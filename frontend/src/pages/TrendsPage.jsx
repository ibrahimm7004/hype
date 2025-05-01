import React from "react";
import SentimentAnalyzer from "../components/trends/SentimentAnalyzer";
import RedditTrends from "../components/trends/RedditTrends";

const TrendsPage = () => {
  return (
    <div>
      TrendsPage
      <SentimentAnalyzer />
      <RedditTrends />
    </div>
  );
};

export default TrendsPage;
