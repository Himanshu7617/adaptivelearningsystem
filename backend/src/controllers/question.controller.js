import path from "path";
import fs from "fs/promises";
import { get_question_by_topic } from "../services/ai.service.js";
import { MASTERY_THRESHOLD } from "../services/session.service.js";
import { get_mastery, predict_next_difficulty } from "../utils/questions.util.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../config/db.js";

const getSessionId = (req) => req.body?.session_id ?? req.query?.session_id;

const getQuestionsFromSession = async (session) => {
    const raw = await fs.readFile(session.filePath, "utf-8");
    const file_content = JSON.parse(raw);
    return file_content.questions ?? [];
};

const pickQuestion = (questions, difficulty, askedQuestions = []) => {
    return questions.find(
        question =>
            question.difficulty === difficulty &&
            !askedQuestions.includes(question.id)
    ) ?? questions.find(question => question.difficulty === difficulty);
};

export const fetch_questions = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({
            error: "topic is required"
        });
    }

    try {
        const questions = await get_question_by_topic(topic);

        const filePath = path.join(
            process.cwd(),
            "src",
            "data",
            "questions",
            `${topic.toLowerCase().replaceAll(" ", "_")}.json`
        );

        await fs.writeFile(
            filePath,
            JSON.stringify(questions, null, 2),
            "utf-8"
        );

        const session = await prisma.session.create({
            data: {
                session_id: uuidv4(),
                topic,
                asked_questions: [],
                filePath
            }
        });

        return res.status(201).json({
            message: "Questions fetched and session created successfully",
            session_id: session.session_id
        });

    } catch (error) {
        console.error("Error creating session:", error);

        return res.status(500).json({
            message: "Failed to create session",
            error: error.message
        });
    }
};

export const get_first_question = async (req, res) => {
    const session_id = getSessionId(req);

    if (!session_id) {
        return res.status(400).json({
            error: "session_id is required"
        });
    }

    try {
        const curr_session = await prisma.session.findUnique({
            where: {
                session_id
            }
        });

        if (!curr_session) {
            return res.status(404).json({
                error: "Session not found"
            });
        }

        const questions = await getQuestionsFromSession(curr_session);
        const askedQuestions = curr_session.asked_questions ?? [];
        const question = pickQuestion(questions, "easy", askedQuestions);

        if (!question) {
            return res.status(404).json({
                error: "No easy question found"
            });
        }

        await prisma.session.update({
            where: {
                session_id
            },
            data: {
                asked_questions: [
                    ...askedQuestions,
                    question.id
                ],
                current_difficulty: question.difficulty
            }
        });

        return res.status(200).json({
            question
        });

    } catch (error) {
        console.error("Error getting first question:", error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};

export const get_next_question = async (req, res) => {
    const features = req.body ?? {};
    const session_id = getSessionId(req);

    if (!session_id) {
        return res.status(400).json({
            error: "session_id is required"
        });
    }

    if (!features.question_id) {
        return res.status(400).json({
            error: "question_id is required"
        });
    }

    try {
        const curr_session = await prisma.session.findUnique({
            where: {
                session_id
            }
        });

        if (!curr_session) {
            return res.status(404).json({
                error: "Session not found"
            });
        }

        const mastery_gain = await get_mastery(features, curr_session.filePath);
        const isCorrect = mastery_gain > 0;
        const updated_mastery = Math.max(
            0,
            curr_session.mastery + mastery_gain
        );

        const answerCounts = {
            correct_answers: isCorrect
                ? curr_session.correct_answers + 1
                : curr_session.correct_answers,
            wrong_answers: isCorrect
                ? curr_session.wrong_answers
                : curr_session.wrong_answers + 1
        };

        if (updated_mastery >= MASTERY_THRESHOLD) {
            await prisma.session.update({
                where: {
                    session_id
                },
                data: {
                    mastery: updated_mastery,
                    ...answerCounts
                }
            });

            return res.status(200).json({
                topic_mastered: true,
                mastery: updated_mastery
            });
        }

        const next_difficulty = predict_next_difficulty(updated_mastery);
        const questions = await getQuestionsFromSession(curr_session);
        const askedQuestions = curr_session.asked_questions ?? [];
        const next_question = pickQuestion(
            questions,
            next_difficulty,
            askedQuestions
        );

        if (!next_question) {
            return res.status(404).json({
                error: "No question found for difficulty level"
            });
        }

        await prisma.session.update({
            where: {
                session_id
            },
            data: {
                mastery: updated_mastery,
                current_difficulty: next_difficulty,
                asked_questions: [
                    ...askedQuestions,
                    next_question.id
                ],
                ...answerCounts
            }
        });

        return res.status(200).json({
            next_question,
            topic_mastered: false,
            mastery: updated_mastery,
            current_difficulty: next_difficulty
        });

    } catch (error) {
        console.error("Error while getting next question:", error);

        return res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};
