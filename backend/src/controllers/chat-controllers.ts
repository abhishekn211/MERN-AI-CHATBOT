import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureAI } from "../config/openai-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  console.log(message);
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // Convert chats to Gemini format
    const history = user.chats.map(({ role, content }) => ({
      role: role ,
      parts: [{ text: content }],
    }));

    try {
      const model = configureAI();
      const chat = model.startChat({ history });
      
      // Send message and get response
      const result = await chat.sendMessage(message);
      const aiResponse = result.response.text();
      
      // Save the new messages
      user.chats.push({ role: "user", content: message });
      user.chats.push({ role: "model", content: aiResponse });
      
      await user.save();
      return res.status(200).json({ chats: user.chats });
      
    } catch (error) {
      if (error.status === 429) {
        return res.status(429).json({ 
          message: "Too many requests. Please try again in a few moments."
        });
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // User token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};