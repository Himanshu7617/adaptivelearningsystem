import fs from "fs/promises";

export const get_mastery = async (features, filePath) => {
    const raw = await fs.readFile(filePath, "utf-8");
    const file_content = JSON.parse(raw);

    const curr_question = file_content.questions.find(
        question => question.id === features.question_id
    );

    if (!curr_question) {
        throw new Error("Question not found in session question file");
    }

    const { difficulty, correctAnswer } = curr_question;
    const submittedAnswer = features.selected_answer ?? features.answer;

    if (difficulty === "easy" && submittedAnswer === correctAnswer) {
        return 0.05;
    } else if (difficulty === "medium" && submittedAnswer === correctAnswer) {
        return 0.1;
    } else if (difficulty === "hard" && submittedAnswer === correctAnswer) {
        return 0.15;
    }

    return -0.08;
};

export const predict_next_difficulty = (mastery) => {
    if (mastery < 0.5) {
        return "easy";
    } else if (mastery >= 0.5 && mastery <= 1) {
        return "medium";
    }

    return "hard";
};
