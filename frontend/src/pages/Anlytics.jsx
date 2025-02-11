import React, { useEffect } from "react";
import twitterCallback from "../utils/twitterCallback";

const Anlytics = () => {
  useEffect(() => {
    // Fetch Twitter OAuth token from localStorage
    const foo = async () => {
      const token = localStorage.getItem("twitter_jwt_token");
      if (!token) {
        setError("No Twitter OAuth token found.");
        setLoading(false);
        return;
      }

      // Fetch profile from API if not found in localStorage
      const response = await twitterCallback(
        `/twitter/analytics?oauth_token=${token}`,
        "GET"
      );

      console.log(response);
    };

    foo();
  }, []);
  return <div>Anlytics</div>;
};

export default Anlytics;
