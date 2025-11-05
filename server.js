
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import 'dotenv/config'; 

const app = express();
app.use(cors());
app.use(express.json());


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});

app.post("/api/embeddings", async (req, res) => {
  try {
    const { input } = req.body;
     console.log("📥 Request body:", req.body);
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });
    res.json(response.data[0].embedding);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    res.json(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
