import {GoogleGenAI} from '@google/genai'
import "./config/env.js";

const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY
})

export default ai;