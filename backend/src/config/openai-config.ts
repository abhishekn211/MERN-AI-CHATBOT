import { GoogleGenerativeAI } from "@google/generative-ai";

export const configureAI = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};
