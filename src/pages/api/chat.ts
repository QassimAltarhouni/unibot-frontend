// pages/api/chat.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('SERVER ERROR: GEMINI_API_KEY environment variable is NOT SET in pages/api/chat.ts');
  throw new Error('GEMINI_API_KEY environment variable is not set. Please check your .env.local file and restart the server.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface GeminiHistoryMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

interface ChatRequestBody {
  message: string;
  history?: GeminiHistoryMessage[];
}

interface ChatResponseBody {
  reply?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponseBody>
) {
  if (req.method === 'POST') {
    try {
      const { message, history }: ChatRequestBody = req.body;

      if (!message) {
        console.error('SERVER ERROR: No message received in API request body.');
        return res.status(400).json({ error: 'Message is required in the request body.' });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      let chat;
      let cleanedHistory: GeminiHistoryMessage[] = [];

      // --- CRITICAL FIX START: Robust History Cleaning on Server ---
      if (history && Array.isArray(history) && history.length > 0) {
        // Find the index of the first 'user' message in the provided history
        const firstUserIndex = history.findIndex(msg => msg.role === 'user');

        if (firstUserIndex === -1) {
          // If no 'user' message is found in history, it means history is all 'model' roles
          // or empty, so we should start a fresh chat.
          console.warn("SERVER WARN: Provided history contains no 'user' roles. Starting new chat.");
          chat = model.startChat(); // Start a new chat without history
        } else if (firstUserIndex > 0) {
          // If the first 'user' message is NOT at index 0, it means there are 'model' roles before it.
          // Slice the history to start from the first 'user' message.
          console.warn(`SERVER WARN: History starts with 'model' role. Slicing history from first 'user' message at index ${firstUserIndex}.`);
          cleanedHistory = history.slice(firstUserIndex);
          chat = model.startChat({ history: cleanedHistory });
        } else {
          // History starts correctly with 'user' or is empty, use it as is.
          cleanedHistory = history;
          chat = model.startChat({ history: cleanedHistory });
        }
      } else {
        // No history provided, start a fresh chat.
        chat = model.startChat();
      }
      // --- CRITICAL FIX END ---

      console.log("SERVER DEBUG: History used for Gemini:", cleanedHistory); // Log what's actually sent to Gemini

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({ reply: text });

    } catch (error: any) {
      console.error('SERVER ERROR: Error communicating with Gemini API:', error);
      res.status(500).json({ error: 'Failed to get a response from Gemini due to a server-side error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}