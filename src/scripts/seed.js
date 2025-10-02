// scripts/seed.js
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import movies from "../content.js"; // مسیر درست فایل content.js خودت را بگذار

dotenv.config();

// اتصال OpenAI
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

// اتصال Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function seed() {
  for (const movie of movies) {
    try {
      // 1. تولید embedding از title + description
      const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: `${movie.title}. ${movie.description}`,
      });
      const embedding = embeddingRes.data[0].embedding;

      // 2. ذخیره در Supabase
      const { error } = await supabase.from("movies_embeddings").insert({
        title: movie.title,
        release_year: movie.release_year,
        description: movie.description,
        embedding,
      });

      if (error) {
        console.error(`❌ Error inserting ${movie.title}:`, error.message);
      } else {
        console.log(`✅ ${movie.title} added successfully`);
      }
    } catch (err) {
      console.error(`❌ Failed on ${movie.title}:`, err.message);
    }
  }

  console.log("🌟 Seeding finished!");
}

seed();
