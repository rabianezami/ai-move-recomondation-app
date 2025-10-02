import React from "react";

function QuestionsView({ answers, handleChange, handleSubmit, loading }) {
  return (
    <div className="questions-view">
      <h2>Answer these questions</h2>
      <input
        type="text"
        name="q1"
        className="form-control my-2"
        placeholder="What’s your favorite movie and why?"
        value={answers.q1}
        onChange={handleChange}
      />
      <input
        type="text"
        name="q2"
        className="form-control my-2"
        placeholder="New or Classic?"
        value={answers.q2}
        onChange={handleChange}
      />
      <input
        type="text"
        name="q3"
        className="form-control my-2"
        placeholder="Fun or Serious?"
        value={answers.q3}
        onChange={handleChange}
      />
      <button className="btn btn-success w-100 mt-3" onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Get Recommendation"}
      </button>
    </div>
  );
}

export default QuestionsView;
