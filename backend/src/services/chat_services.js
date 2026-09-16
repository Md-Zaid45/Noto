import ai from "../GenAI/connection.js";
import ApiError from "../utils/ApiError.js";
const MODEL=process.env.MODEL
async function generate(prompt, jsonMode = true) {
  try {
    const completion = await ai.chat.completions.create({
      model: "qwen/qwen3-32b",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      ...(jsonMode && {
        response_format: {
          type: "json_object",
        },
      }),
    });

    const text = completion.choices[0].message.content;
    return jsonMode ? JSON.parse(text) : text;
  } catch (error) {
    console.error("AI generation error:", error.message);
    throw error;
}
}
export async function generateFlashcards(context, count = 10) {
  const prompt = `
You are an expert educator. Using ONLY the content below, generate exactly ${count} high-quality flashcards.
Each flashcard must test a single, clear concept. Prefer specific facts, definitions, and cause-effect over vague generalities.

CONTENT:
${context}

Return a JSON object with this exact shape:
{
  "flashcards": [
    { "question": "<concise question>", "answer": "<clear, complete answer>" }
  ]
}

Rules:
- Do NOT invent facts outside the content.
- Questions should be self-contained (understandable without the source text).
- Answers should be 1–3 sentences.
`;
  const result = await generate(prompt);
  if (!result.flashcards || !Array.isArray(result.flashcards)) {
    throw new ApiError(500, "Malformed flashcard response from AI");
  }
  return result.flashcards;
}

// ─── 2. Quiz Generation ──────────────────────────────────────────────────────

/**
 * Generates a multiple-choice quiz from a RAG context.
 *
 * @param {string} context  - Retrieved chunks
 * @param {number} count    - Number of questions (default 5)
 * @returns {Array<{question, options, correctIndex, explanation}>}
 */
export async function generateQuiz(context, count = 5) {
  const prompt = `
You are an expert educator creating a multiple-choice quiz. Use ONLY the content below.

CONTENT:
${context}

Generate exactly ${count} multiple-choice questions. Each question must have exactly 4 options (A, B, C, D).
Return a JSON object:
{
  "quiz": [
    {
      "question": "<the question>",
      "options": ["<A>", "<B>", "<C>", "<D>"],
      "correctIndex": <0-3>,
      "explanation": "<why the correct answer is right, 1-2 sentences>"
    }
  ]
}

Rules:
- Distractors must be plausible but clearly wrong to someone who understands the material.
- correctIndex is 0-based (0 = A, 1 = B, 2 = C, 3 = D).
- Do NOT invent facts outside the content.
`;
  const result = await generate(prompt);
  if (!result.quiz || !Array.isArray(result.quiz)) {
    throw new ApiError(500, "Malformed quiz response from AI");
  }
  return result.quiz;
}

// ─── 3. Note Summary ─────────────────────────────────────────────────────────

/**
 * Summarises a note at a given detail level.
 *
 * @param {string} context      - Full note text (or top chunks)
 * @param {"brief"|"detailed"|"bullets"} style
 * @returns {string}            - The summary text
 */
export async function summariseNote(context, style = "detailed") {
  const styleGuide = {
    brief:
      "Write a single paragraph (3–5 sentences) covering only the most critical points.",
    detailed:
      "Write a structured summary with an introductory sentence, 3–5 key sections as short paragraphs, and a closing takeaway.",
    bullets:
      "Return a bullet-point list (use '-') of the 7–10 most important points. Each bullet must be a complete sentence.",
  };

  const prompt = `
You are a precise note-taking assistant. Summarise the content below.
Style: ${styleGuide[style] || styleGuide.detailed}

CONTENT:
${context}

Do not include anything not found in the content. Do not use headers unless the style is "detailed".
`;
  return await generate(prompt, false);
}

// ─── 4. QnA (RAG Chat) ───────────────────────────────────────────────────────

/**
 * Answers a user question using retrieved context.
 *
 * @param {string} question       - The user's question
 * @param {string} context        - Top-k retrieved chunks
 * @param {Array}  history        - [{role:"user"|"model", text:string}] conversation turns
 * @returns {{ answer: string, sourceChunks: number[] }}
 */
export async function answerQuestion(question, context, history = []) {
  const historyText = history
    .map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`)
    .join("\n");

  const prompt = `
You are a knowledgeable assistant helping a student understand their notes.
Answer the question using ONLY the provided context. If the answer is not in the context, say:
"I couldn't find this in your notes. Try rephrasing or check your notes directly."

${history.length ? `CONVERSATION HISTORY:\n${historyText}\n` : ""}

CONTEXT FROM NOTES:
${context}

QUESTION: ${question}

Return a JSON object:
{
  "answer": "<your answer, markdown-formatted>",
  "confidence": "high|medium|low",
  "suggestion": "<optional follow-up question the student might ask, or null>"
}
`;
  const result = await generate(prompt);
  if (!result.answer) throw new ApiError(500, "Malformed QnA response from AI");
  return result;
}
