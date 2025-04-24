import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import fetchData from "../../utils/fetchData";

const FacebookCallback = () => {
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sendCallbackData = async () => {
      const params = new URLSearchParams(window.location.search);
      console.log(params);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      console.log(code, state);

      if (error) {
        setStatus("error");
        setMessage(`Facebook login failed: ${error}`);
        return;
      }

      try {
        const response = await fetchData(
          `/meta/facebook/callback?code=${code}&state=${state}`
        );
        console.log(response.status);
        if (response.status == 200) {
          console.log("respone is OK");
          localStorage.setItem("meta/facebook_authenticated", "true");
          setStatus("success");
          setMessage("Facebook account successfully connected!");

          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(result.error || "Something went wrong.");
        }
      } catch (err) {
        console.log(err);
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    sendCallbackData();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-100 p-6"
    >
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        {status === "loading" && (
          <motion.div
            className="text-lg text-gray-700 font-medium"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            Connecting your Facebook...
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-green-600 font-semibold text-xl"
          >
            ✅ {message}
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-red-600 font-semibold text-xl"
          >
            ❌ {message}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FacebookCallback;
