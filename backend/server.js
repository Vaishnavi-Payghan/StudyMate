
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { InferenceClient } = require("@huggingface/inference");

const app = express();

app.use(cors());
app.use(express.json());

const client = new InferenceClient(process.env.HF_TOKEN);

app.post("/api/analyze", async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                error: "Question and answer are required."
            });
        }

        const prompt = `
You are StudyMate, a friendly interview practice partner.

Analyze this student's interview answer.

Question:
${question}

Student's answer:
${answer}

Give feedback using this format:

SCORE: X/10

STRENGTHS:
- Give 2 specific strengths.

IMPROVEMENTS:
- Give 2 specific improvements.

BETTER APPROACH:
Give a short improved version of the answer.

Be encouraging and beginner-friendly.
`;

        const response = await client.chatCompletion({
            model: "meta-llama/Llama-3.1-8B-Instruct",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500
        });

        const feedback = response.choices[0].message.content;

        res.json({
            feedback: feedback
        });

    } catch (error) {
        console.error("AI Error:", error);

        res.status(500).json({
            error: "Unable to analyze the answer."
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`StudyMate backend running on http://localhost:${PORT}`);
});
