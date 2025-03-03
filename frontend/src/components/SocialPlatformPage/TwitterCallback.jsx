import { useState, useEffect } from "react";
import React from "react";
import twitterCallback from "../../utils/twitterCallback";
import BubbleAnimation from "./BubbleAnimation";
import fetchData from "../../utils/fetchData";

const TwitterCallback = () => {
  const [oauthToken, setOauthToken] = useState(null);
  const [oauthVerifier, setOauthVerifier] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchTwitterCallback = async () => {
      try {
        // http://localhost:5173/social-platform/callback?oauth_token=Lz2oOQAAAAABystQAAABlV2xNd0&oauth_verifier=t2mB6Rz7L7fvAi4KSae5wk2qmRze3rzO
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("oauth_token");
        const verifier = urlParams.get("oauth_verifier");

        if (token && verifier) {
          setOauthToken(token);
          setOauthVerifier(verifier);

          console.log("url", window.location.search);

          // Await the API call
          const res = await fetchData(
            `/twitter/callback?oauth_token=${token}&oauth_verifier=${verifier}`,
            "GET"
          );

          // localStorage.setItem("twitter_jwt_token", res.data.twitter_token);

          // console.log("Response (Twitter Callback):", res);
          // const profile = await twitterCallback(
          //   `/twitter/profile?oauth_token=${token}&oauth_verifier=${verifier}`,
          //   "GET"
          // );

          // console.log("Profile (Twitter Callback):", profile);

          setResponse(res); // Store response in state

          // Redirect to Twitter Profile Page
          window.location.href = "/social-platform/twitter";
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
      {oauthToken && oauthVerifier ? (
        // <div>
        //   <p>OAuth Token: {oauthToken}</p>
        //   <p>OAuth Verifier: {oauthVerifier}</p>
        //   {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        // </div>
        <div>
          <p className="font-semibold mx-auto my-10 text-center">
            Twitter OAuth Successful!
          </p>
          <p className="animate-pulse text-lg mx-auto my-10 text-center">
            Redirecting...
          </p>
        </div>
      ) : (
        <BubbleAnimation />
        // <p>Loading or missing parameters...</p>
      )}
    </div>
  );
};

export default TwitterCallback;
