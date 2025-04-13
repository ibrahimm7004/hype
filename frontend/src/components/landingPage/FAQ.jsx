import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

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
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.3, delay: 0.5 }
    );
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={faqRef}
      id="faq"
      className="py-24 max-w-5xl mx-auto text-center"
    >
      <h2 className="text-5xl font-bold mb-12">
        Frequently Asked <span className="gradient-text">Questions</span>
      </h2>
      <div className="space-y-6">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="faq-item border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left cursor-pointer transition-all"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">{faq.question}</h3>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </div>
            <p
              className={`text-gray-500 dark:text-gray-300 mt-3 overflow-hidden transition-all ${
                openIndex === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
