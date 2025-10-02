// src/App.js
import React, { useState, useEffect } from "react";
import { openai, supabase } from "./config";
import movies from "./content.js";
import Layout from "./Layout";

function App() {
  const [step, setStep] = useState("questions");
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  // هنگام mount اپ، embedding فیلم‌ها را در Supabase ذخیره کن
  useEffect(() => {
    async function storeMovieEmbeddings() {
      for (let movie of movies) {
        // چک کن که قبلاً در Supabase ذخیره نشده باشد
        const { data: existing } = await supabase
          .from("movies_embeddings")
          .select("*")
          .eq("title", movie.title);

        if (existing.length === 0) {
          // ساخت embedding برای هر فیلم
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: movie.content
          });

          const movieEmbedding = embeddingResponse.data[0].embedding;

          await supabase.from("movies_embeddings").insert([
            {
              title: movie.title,
              releaseYear: movie.releaseYear,
              content: movie.content,
              embedding: movieEmbedding
            }
          ]);
        }
      }
    }

    storeMovieEmbeddings();
  }, []);

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // 1️⃣ ترکیب پاسخ کاربر
      const userInput = `${answers.q1} ${answers.q2} ${answers.q3}`;

      // 2️⃣ ساخت embedding برای پاسخ کاربر
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: userInput
      });
      const userEmbedding = embeddingResponse.data[0].embedding;

      // 3️⃣ جستجو در Supabase برای نزدیک‌ترین فیلم
      const { data: moviesData, error } = await supabase.rpc(
        "match_movies", // این RPC باید در Supabase تعریف شده باشد
        {
          query_embedding: userEmbedding,
          match_count: 1
        }
      );

      if (error || moviesData.length === 0) {
        throw new Error("No matching movies found.");
      }

      const matchedMovie = moviesData[0];

      // 4️⃣ گرفتن توضیح AI
      const explanationResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful movie recommender." },
          {
            role: "user",
            content: `Why is "${matchedMovie.title}" a good movie choice for these preferences: ${userInput}? Keep it short and friendly.`
          }
        ]
      });

      const reason =
        explanationResponse.choices[0].message.content || "Great choice for you!";

      // 5️⃣ نمایش نتیجه
      setRecommendation({
        title: matchedMovie.title,
        year: matchedMovie.release_year,
        description: matchedMovie.description,
        reason
      });

      setStep("result");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      step={step}
      answers={answers}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      recommendation={recommendation}
      setStep={setStep}
    />
  );
}

export default App;
