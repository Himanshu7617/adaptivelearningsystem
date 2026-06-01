export const get_question_by_topic_prompt = (TOPIC) => {

return  `

You are an educational content generation system.

Generate a question bank for the topic: "{TOPIC}"

Requirements:

1. Generate exactly:
- 10 easy questions
- 10 medium questions
- 10 hard questions

2. Return ONLY valid JSON.
Do not return markdown.
Do not explain anything.

3. Output format:

{
  "topic": "",
  "questions": [
    {
      "id": "",
      "difficulty": "easy | medium | hard",

      "questionType": "mcq",

      "question": "",

      "options": [
        "",
        "",
        "",
        ""
      ],

      "correctAnswer": "",

      "explanation": "",

      "estimatedTimeSeconds": 30,

      "concepts": [
        ""
      ],

      "tags": [
        ""
      ],

      "learningObjective": "",

      "prerequisiteLevel": 1,

      "difficultyScore": 1,

      "sourceType": "generated"
    }
  ]
}

Rules:

- Questions must progress naturally in complexity.
- Easy → definitions/basic understanding.
- Medium → application/problem solving.
- Hard → analysis/design/edge cases.
- Correct answer must exactly match one option.
- Explanations must be concise (2–4 lines).
- Every question must have exactly 4 options.
- estimatedTimeSeconds should match difficulty.
- difficultyScore:
  easy → 1–3
  medium → 4–7
  hard → 8–10
- IDs must be unique:
  q1, q2, q3...
- concepts should contain concepts tested.
- tags should contain topic-related keywords.
- No duplicate questions.
- Avoid ambiguous wording.

Topic:
${TOPIC}
`;}