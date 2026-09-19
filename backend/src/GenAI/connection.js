import "../config/env.js";

import OpenAI from "openai";

let _ai = null;

export default function getAI() {
  if (!_ai) {
    _ai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.GEMINI_API_KEY,
    });
  }
  return _ai;
}
