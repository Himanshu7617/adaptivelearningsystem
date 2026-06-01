import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { get_question_by_topic_prompt } from "../data/prompts/questions.prompt.js";
import path from "path";


dotenv.config();



const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY
})

export const get_question_by_topic = async (topic ) => { 
    //generating prompt
    const prompt = get_question_by_topic_prompt(topic);


    //generating questions
    const response = await ai.models.generateContent({
        model : "gemini-3.5-flash",
        contents : prompt,
    });

    //saving questions
    const generatedText = response.text;
    const questions = JSON.parse(generatedText);

    return questions;

    
}