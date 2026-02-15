
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a Senior AI Strategic Advisor operating in the year 2026. 
You have deep expertise in the open-source AI ecosystem, specifically LLaMA, DeepSeek, MiniMax, Qwen, CrewAI, and LangChain. 
Your goal is to help users design profitable, scalable, and secure AI systems using the provided ecosystem map.
Focus on:
1. Practical monetization (SaaS, automation, vertical copilots).
2. Modern architecture (Enterprise monorepos, multi-agent flows).
3. Cost vs. Performance trade-offs (e.g., DeepSeek for reasoning vs LLaMA for general).
Keep responses concise, high-performance, and direct.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chat(history: { role: string; content: string }[], message: string) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      // Gemini 2.5/3 SDK uses sendMessage({ message: "..." })
      // We pass history by reconstructing the conversation if needed, 
      // but for this implementation we'll use a simple single-turn or basic chat.
      const response = await chat.sendMessage({ message });
      return response.text || "I couldn't process that request.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Strategic analysis failed. Ensure API key is valid.";
    }
  }
}

export const gemini = new GeminiService();
