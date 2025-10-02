import React from "react";

function ResultView({ recommendation, setStep }) {
  return (
    <div className="result-view text-center">
      <h2>
        🎬 {recommendation.title} ({recommendation.year})
      </h2>
      <p>{recommendation.description}</p>
      <p className="ai-reason">👉 {recommendation.reason}</p>
      <button className="btn btn-primary mt-3" onClick={() => setStep("questions")}>
        Go Again
      </button>
    </div>
  );
}

export default ResultView;
