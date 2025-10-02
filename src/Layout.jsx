// src/Layout.jsx
import React from "react";

function Layout({ step, answers, handleChange, handleSubmit, loading, recommendation, setStep }) {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
      <div className="col-12 col-md-8 col-lg-6 p-4">
        {/* لوگو */}
        <div className="text-center mb-4">
          <img src="/Branding.png" alt="logo" width="150" />
        </div>

        {/* فرم سوالات */}
        {step === "questions" && (
          <div className="px-5">
            <div className="mb-4">
              <label className="form-label">What’s your favorite movie and why?</label>
              <textarea
                type="text"
                name="q1"
                className="form-control big-input"
                value={answers.q1}
                onChange={handleChange}
                placeholder="For example: The Shawshank Redemption, because it has a powerful story..."
                ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Are you in the mood for something new or a classic?</label>
              <textarea
                type="text"
                name="q2"
                className="form-control"
                value={answers.q2}
                onChange={handleChange}
                placeholder="I want to watch movies after 1990..."
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label">Do you wanna have fun or do you want something serious?</label>
              <textarea
                type="text"
                name="q3"
                className="form-control"
                value={answers.q3}
                onChange={handleChange}
                placeholder="I want to watch movies after 1990, especially something refreshing..."
              ></textarea>
            </div>

            <button
              className="btn text-dark fs-3 w-100 fw-bold"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Let’s Go"}
            </button>
          </div>
        )}

        {/* نتیجه */}
        {step === "result" && recommendation && (
          <div className="text-center">
            <h2 className="fw-bold">
              🎬 {recommendation.title} ({recommendation.year})
            </h2>
            <p className="mt-3">{recommendation.description}</p>
            <p className="fst-italic">{recommendation.reason}</p>

            <button
              className="btn btn-success w-100 fw-bold mt-3"
              onClick={() => setStep("questions")}
            >
              Go Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Layout;
