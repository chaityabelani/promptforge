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
      const { tags, description, image } = req.body;
      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ error: "Please provide at least one tag." });
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

      let promptStr = `You are an expert creative prompt engineer. The user wants a creative writing or coding prompt based on the following concepts/tags: ${tags.join(", ")}.`;
      
      if (description && description.trim().length > 0) {
        promptStr += `\nThey also provided this specific description/idea: "${description}". Incorporate this idea deeply into the generated prompt.`;
      }
      
      if (image) {
        promptStr += `\nTake heavy inspiration from the provided image. Combine aspects seen in the image with the provided tags and idea.`;
      }
      
      promptStr += `\nGenerate a high-quality, inspiring, and detailed prompt. Ensure the prompt is ready to be used by a user to copy and paste into an AI or use for writing/coding.
Provide the response as a cohesive block of text. Avoid unnecessary conversational filler.`;

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
