import "../config/env.js";

import OpenAI from "openai";

const ai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY,
});

export default ai;