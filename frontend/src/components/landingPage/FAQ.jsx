import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    question: "How does AI SaaS work?",
    answer:
      "Our AI-driven platform automates workflows, enhances decision-making, and integrates seamlessly with your tools.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial with access to all premium features.",
  },
  {
    question: "What makes AI SaaS different?",
    answer:
      "Unlike others, we provide predictive AI, deep analytics, and full automation in one seamless experience.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. You can cancel your subscription anytime with no hidden fees.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      faqRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    faqData.forEach((_, index) => {
      const item = document.getElementById(`faq-answer-${index}`);
      if (item) {
        if (openIndex === index) {
          gsap.to(item, {
            height: "auto",
            opacity: 1,
            paddingTop: 16,
            paddingBottom: 16,
            duration: 0.6,
            ease: "power3.out",
          });
        } else {
          gsap.to(item, {
            height: 0,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 0.5,
            ease: "power3.inOut",
          });
        }
      }
    });
  }, [openIndex]);

  return (
    <section
      ref={faqRef}
      id="faq"
      className="py-24 max-w-4xl mx-auto px-6 text-center"
    >
      <h2 className="text-5xl font-extrabold mb-16 leading-tight">
        Frequently Asked{" "}
        <span className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
          Questions
        </span>
      </h2>

      <div className="space-y-8">
        {faqData.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className="faq-item backdrop-blur-md bg-white/10 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700 rounded-2xl p-6 text-left cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-pink-400 relative overflow-hidden"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {faq.question}
              </h3>
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                  openIndex === index
                    ? "bg-gradient-to-tr from-pink-500 to-purple-500 text-white rotate-45"
                    : "bg-white/30 dark:bg-gray-700/50 text-gray-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
            </div>
            <div
              id={`faq-answer-${index}`}
              className="overflow-hidden text-gray-700 dark:text-gray-300 mt-4 text-lg leading-relaxed"
              style={{ height: 0, opacity: 0 }}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
