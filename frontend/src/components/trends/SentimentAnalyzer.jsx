import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fetchData from "../../utils/fetchData";

const featureDescriptions = {
  polarity_score: "Numerical score between -1 (negative) to 1 (positive).",
  sentiment_label: "Categorizes sentiment as Positive, Negative, or Neutral.",
  emotions: "Detects 1–3 dominant emotions (e.g. joy, anger, fear).",
  subjectivity_score: "Score from 0 (objective) to 1 (subjective).",
  hateful_speech: "Detects if content is hateful or abusive.",
  sarcasm: "Checks for sarcasm or irony in tone.",
  engagement_prediction: "Estimates social media engagement (High/Medium/Low).",
};

const SentimentAnalyzer = () => {
  const [text, setText] = useState("");
  const [feature, setFeature] = useState("sentiment_label");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await fetchData("/trends/sentiment", "POST", {
        text,
        feature,
      });
      setResult(response.data);
    } catch (error) {
      setErrorMsg("Something went wrong. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-100 to-white p-10">
      <motion.div
        className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✨ Sentiment Analyzer
        </h2>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          rows={5}
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center gap-4 mb-4">
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none"
          >
            {Object.keys(featureDescriptions).map((f) => (
              <option key={f} value={f}>
                {f.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>

          <button
            onClick={analyze}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="loader h-4 w-4 border-2 border-white rounded-full animate-spin" />
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {featureDescriptions[feature]}
        </p>

        <AnimatePresence>
          {result && (
            <motion.div
              className="border-t border-gray-200 pt-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <p className="text-gray-500 text-sm mb-1">
                Feature:{" "}
                <strong className="capitalize">
                  {result.feature.replace(/_/g, " ")}
                </strong>
              </p>
              <p className="text-xl font-bold text-indigo-700">
                {result.value}
              </p>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              className="bg-red-100 border border-red-300 text-red-700 rounded-md p-3 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SentimentAnalyzer;
