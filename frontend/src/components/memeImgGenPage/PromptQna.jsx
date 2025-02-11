import React, { useEffect, useState } from "react";

const PromptQna = ({ setPromptQna, generatePostHandler }) => {
  const questions = [
    // Step 1: Audience, Product & Industry
    [
      {
        id: "primary_audience",
        question: "Who is the primary target audience for the meme?",
        options: [
          "Kids (Under 13)",
          "Teens (13-17)",
          "Young Adults (18-24)",
          "Millennials (25-34)",
          "Adults (35-50)",
          "Older Adults (50+)",
          "General Audience (All Ages)",
        ],
        type: "checkbox", // Single choice
      },
      {
        id: "secondary_audience",
        question: "Who is the secondary target audience?",
        options: [
          "None (Highly niche meme)",
          "Teens (13-17)",
          "Young Adults (18-24)",
          "Millennials (25-34)",
          "Adults (35-50)",
          "Older Adults (50+)",
          "General Audience (All Ages)",
          "Professionals (Corporate/Workplace Humor)",
          "Tech Enthusiasts (Niche Internet/Tech Culture)",
          "Gamers (Gaming-Related Humor)",
          "Pop Culture Fans (TV, Movies, Celebrities, Anime, etc.)",
        ],
        type: "checkbox", // Multi-choice
      },
    ],
    // Step 2: Product, Industry & Humor Style
    [
      {
        id: "industry",
        question: "Which industry does the meme align with?",
        options: [
          "eCommerce",
          "Fashion & Beauty",
          "Food & Beverage",
          "Tech & Software",
          "Finance & Banking",
          "Healthcare & Wellness",
          "Education & E-Learning",
          "Entertainment & Media",
          "Automotive",
          "Travel & Hospitality",
          "B2B & Corporate",
          "General (Works for multiple industries)",
        ],
        type: "dropdown", // Dropdown selection
      },
      {
        id: "humor_style",
        question: "What humor style does the meme use?",
        options: [
          "Relatable",
          "Sarcastic",
          "Wholesome",
          "Dark Humor",
          "Satirical",
          "Self-Deprecating",
          "Absurd/Random",
          "Workplace/Corporate",
          "Pop Culture Reference",
          "Nostalgic",
          "Reaction-Based",
        ],
        type: "checkbox", // Multi-choice
      },
    ],
    // Step 3: Engagement, Emotion & Tone
    [
      {
        id: "engagement_type",
        question: "What type of engagement does the meme encourage?",
        options: [
          "Tag a Friend",
          "Shareable Joke",
          "Call to Action (CTA)",
          "Comment Bait (Encourages Replies)",
          "Self-Identification ('This is so me')",
          "Educational Awareness",
          "Controversial (Encourages Debate)",
          "Nostalgic Engagement ('Remember this?')",
          "General Entertainment (No Specific Engagement Focus)",
        ],
        type: "checkbox", // Multi-choice
      },
      {
        id: "emotion_targeted",
        question: "What emotion does the meme target?",
        options: [
          "FOMO (Fear of Missing Out)",
          "Excitement",
          "Regret",
          "Confidence",
          "Shock/Surprise",
          "Confusion",
          "Happiness/Joy",
          "Frustration",
          "Empowerment",
          "Curiosity",
        ],
        type: "checkbox", // Multi-choice
      },
      {
        id: "tone_alignment",
        question: "What type of brand tone does the meme align with?",
        options: [
          "Playful & Casual",
          "Premium Yet Fun",
          "Strictly Professional",
          "Luxury & Exclusive",
          "Edgy & Bold",
          "Trendy & Youth-Focused",
          "Nostalgic & Feel-Good",
          "Corporate & Safe Humor",
          "General (Fits Most Brands)",
        ],
        type: "checkbox", // Single choice
      },
    ],
  ];

  const [step, setStep] = useState(0); // Track the current step
  const [answers, setAnswers] = useState({}); // Store the answers

  useEffect(() => {
    console.log(answers);
  }, [answers]);
  const handleChange = (id, value) => {
    setPromptQna((prev) => ({ ...prev, [id]: value }));
    setAnswers((prev) => ({
      ...prev,
      [id]: prev[id]?.includes(value)
        ? prev[id].filter((item) => item !== value) // Remove if already present
        : [...(prev[id] || []), value], // Add if not present
    }));
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Call the generatePostHandler with all answers
    generatePostHandler();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4 text-gray-900">
        Meme Categorization Form
      </h1>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="flex mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {step + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Dynamic Questions */}
      {questions[step].map((q) => (
        <div key={q.id} className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            {q.question}
          </label>
          {/* {q.type === "radio" && (
            <div>
              {q.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="radio"
                    id={option}
                    name={q.id}
                    value={option}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    checked={answers[q.id] === option}
                  />
                  <label className="ml-2">{option}</label>
                </div>
              ))}
            </div>
          )} */}

          {q.type === "checkbox" && (
            <div>
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                  htmlFor={option}
                >
                  <input
                    multiple={true}
                    type="checkbox"
                    id={option}
                    value={option}
                    onChange={(e) =>
                      handleChange(q.id, option, e.target.checked)
                    }
                    checked={answers[q.id]?.includes(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {q.type === "dropdown" && (
            <select
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="w-full border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select an option
              </option>
              {q.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button
            onClick={prevStep}
            className="text-gray-600 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        {step < questions.length - 1 ? (
          <button
            onClick={nextStep}
            className="text-white bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="text-white bg-green-600 py-2 px-4 rounded-md hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default PromptQna;
