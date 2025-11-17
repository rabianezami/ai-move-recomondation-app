import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "No input provided" });

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    res.json(response.data[0].embedding);
  } catch (err) {
    console.error("Embedding API error:", err);
    res.status(500).json({ error: "Embedding API error" });
  }
});

export default router;
