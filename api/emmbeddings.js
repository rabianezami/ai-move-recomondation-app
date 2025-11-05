import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input } = req.body;
    console.log("📥 Request body:", req.body);

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    res.status(200).json(response.data[0].embedding);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
