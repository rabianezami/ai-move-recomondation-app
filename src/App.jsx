// src/App.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "./config"; // Supabase
import movies from "./content.js";
import Layout from "./Layout";

const SERVER_URL = "/api";

function App() {
  const [step, setStep] = useState("questions");
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    async function storeMovieEmbeddings() {
      for (let movie of movies) {
        const { data: existing } = await supabase
          .from("movies_embeddings")
          .select("*")
          .eq("title", movie.title);

        if (!existing || existing.length === 0) {
          try {
            const embeddingResponse = await fetch(`${SERVER_URL}/embedding`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ input: movie.description }),
            });

            const movieEmbedding = await embeddingResponse.json();

            await supabase.from("movies_embeddings").insert([
              {
                title: movie.title,
                release_year: parseInt(movie.release_year),
                content: movie.description,
                embedding: movieEmbedding,
              },
            ]);
          } catch (err) {
            console.error("Error storing movie embeddings:", err);
          }
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
      const userInput = `${answers.q1} ${answers.q2} ${answers.q3}`.trim();
      if (!userInput) {
        alert("Please answer at least one question!");
        setLoading(false);
        return;
      }

      // Embedding کاربر
      const embeddingResponse = await fetch(`${SERVER_URL}/embedding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: userInput }),
      });

      const userEmbedding = await embeddingResponse.json();

      // جستجوی فیلم نزدیک
      const { data: moviesData, error } = await supabase.rpc("match_movies", {
        query_embedding: userEmbedding,
        match_count: 1,
      });

      if (error || !moviesData || moviesData.length === 0) {
        throw new Error("No matching movies found.");
      }

      const matchedMovie = moviesData[0];

      // دریافت توضیح AI
      const explanationResponse = await fetch(`${SERVER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful movie recommender." },
            {
              role: "user",
              content: `Why is "${matchedMovie.title}" a good movie choice for these preferences: ${userInput}? Keep it short and friendly.`,
            },
          ],
        }),
      });

      const reasonData = await explanationResponse.json();
      const reason = reasonData.message;

      setRecommendation({
        title: matchedMovie.title,
        year: matchedMovie.release_year,
        description: matchedMovie.description,
        reason,
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
