import { useState, useEffect } from "react";
import React from "react";
import twitterCallback from "../../utils/twitterCallback";
import BubbleAnimation from "./BubbleAnimation";

const TwitterCallback = () => {
  const [oauthToken, setOauthToken] = useState(null);
  const [oauthVerifier, setOauthVerifier] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchTwitterCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("oauth_token");
        const verifier = urlParams.get("oauth_verifier");

        if (token && verifier) {
          setOauthToken(token);
          setOauthVerifier(verifier);

          console.log("url", window.location.search);

          // Await the API call
          const res = await twitterCallback(
            `/twitter/callback?oauth_token=${token}&oauth_verifier=${verifier}`,
            "GET"
          );

          localStorage.setItem("twitter_jwt_token", res.data.twitter_token);

          console.log("Response (Twitter Callback):", res);
          const profile = await twitterCallback(
            `/twitter/profile?oauth_token=${token}&oauth_verifier=${verifier}`,
            "GET"
          );

          console.log("Profile (Twitter Callback):", profile);

          setResponse(res); // Store response in state
        } else {
          console.error("Missing required parameters in URL");
        }
      } catch (error) {
        console.error("Error in Twitter OAuth Callback:", error);
      }
    };

    fetchTwitterCallback(); // Call the async function inside useEffect
  }, []); // Runs only on component mount

  return (
    <div>
      <h1>Twitter OAuth Callback</h1>
      {oauthToken && oauthVerifier ? (
        <div>
          <p>OAuth Token: {oauthToken}</p>
          <p>OAuth Verifier: {oauthVerifier}</p>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
      ) : (
        <BubbleAnimation />
        // <p>Loading or missing parameters...</p>
      )}
    </div>
  );
};

export default TwitterCallback;
