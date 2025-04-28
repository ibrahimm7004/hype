import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger with GSAP
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

  // Animate when the FAQ section comes into view
  useEffect(() => {
    gsap.fromTo(
      faqRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: faqRef.current,
          start: "top 80%", // Animation starts when the section is 80% into view
          end: "bottom 20%",
          scrub: true, // Optional: smooth scroll-based animation
        },
      }
    );

    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.1,
        delay: 0.5,
        scrollTrigger: {
          trigger: ".faq-item",
          start: "top 90%", // Animation triggers when FAQ item comes into view
          end: "bottom 10%",
          toggleActions: "play none none reverse", // Toggle animation when scrolling in/out of view
        },
      }
    );
  }, []);

  // Handle the expansion/collapse animation of the FAQ items
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // GSAP animation for expanding and collapsing the FAQ answer
  useEffect(() => {
    if (openIndex !== null) {
      const item = document.getElementById(`faq-item-${openIndex}`);
      gsap.to(item.querySelector(".faq-answer"), {
        duration: 0.5,
        maxHeight: "200px", // Or any max height you prefer for the expanded section
        opacity: 1,
        ease: "power2.out",
      });
    } else {
      faqData.forEach((_, index) => {
        const item = document.getElementById(`faq-item-${index}`);
        gsap.to(item.querySelector(".faq-answer"), {
          duration: 0.5,
          maxHeight: "0px",
          opacity: 0,
          ease: "power2.in",
        });
      });
    }
  }, [openIndex]);

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
            id={`faq-item-${index}`}
            key={index}
            className="faq-item border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left cursor-pointer transition-all"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">{faq.question}</h3>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </div>
            <p
              className={`faq-answer text-gray-800  mt-3 overflow-hidden transition-all`}
              style={{
                maxHeight: openIndex === index ? "200px" : "0px",
                opacity: openIndex === index ? 1 : 0,
              }}
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
