import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route for Prompt Generation
  app.post("/api/generate-prompt", async (req, res) => {
    try {
      const { tags, description, image, persona } = req.body;
      if (!tags && !image && !description) {
        return res.status(400).json({ error: "Please provide at least a tag, description, or image." });
      }

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let promptStr = `You are an expert prompt engineer. Your goal is to write a highly detailed, extremely accurate, and specialized prompt that the user can copy-paste into an AI model (like ChatGPT, Claude, or Gemini) to get the best possible result.`;
      
      if (persona) {
         promptStr += `\n\nTarget AI Persona: The prompt you generate MUST instruct the AI to act as a "${persona}". Incorporate this deeply into the generated prompt's instructions.`;
      }

      if (tags && tags.length > 0) {
        promptStr += `\n\nContext/Tags: Ensure the prompt revolves around these concepts: ${tags.join(", ")}.`;
      }
      
      if (description && description.trim().length > 0) {
        promptStr += `\n\nSpecific Idea/Description from User: "${description}". The generated prompt must heavily focus on bringing this specific idea to life.`;
      }
      
      if (image) {
        promptStr += `\n\nVisual Inspiration: Take heavy inspiration from the provided image. Describe the key elements and atmosphere of the image and weave them into the prompt.`;
      }
      
      promptStr += `\n\nRequirements for the Generated Prompt:
- DO NOT answer the user's idea directly. You are GENERATING A PROMPT for them to use.
- The output should be JUST the prompt, ready to copy and paste. Do not include introductory or concluding remarks like "Here is your prompt:".
- Make it highly structured, potentially using markdown, clear constraints, and precise instructions.
- Ensure it asks the target AI to break down complex tasks, use a specific tone, or follow a format if relevant to the tags/description.`;

      let promptContents: any[] = [promptStr];
      if (image) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          promptContents.push({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: promptContents,
      });

      res.json({ prompt: response.text });
    } catch (error: any) {
      console.error("Error generating prompt:", error);
      res.status(500).json({ error: error.message || "Failed to generate prompt." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
