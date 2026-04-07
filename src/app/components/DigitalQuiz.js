"use client";

import { useState } from "react";
import { Anek_Tamil } from "next/font/google";
import styles from "./DigitalQuiz.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const quizData = [
  {
    title: "What industry is your business in?",
    subtitle: "Select the option that best describes your business.",
    options: [
      "Retail / E-commerce",
      "Food & Hospitality",
      "Healthcare / Clinic",
      "Education / Coaching",
      "Real Estate",
      "Professional Services",
      "Manufacturing",
      "Other",
    ],
  },
  {
    title: "Do you currently have a business website?",
    subtitle: "Tell us about your current online presence.",
    options: [
      "Yes, and it's up to date",
      "Yes, but it's outdated",
      "No, but I'm planning one",
      "No, I don't have one",
    ],
  },
  {
    title: "Are you active on social media platforms? If yes, which ones?",
    subtitle: "Select all the platforms you currently use.",
    options: [
      "Instagram",
      "Facebook",
      "LinkedIn",
      "YouTube",
      "X (Twitter)",
      "WhatsApp Business",
      "None",
      "Other",
    ],
  },
  {
    title: "Do you run paid ads on social media or Google?",
    subtitle: "Let us know about your current advertising efforts.",
    options: [
      "Yes, on Google Ads",
      "Yes, on Meta (FB/IG)",
      "Yes, on both",
      "No, but I want to start",
      "No, not interested",
      "Tried but stopped",
    ],
  },
  {
    title: "How do you currently generate leads — online, offline, or both?",
    subtitle: "Select the option that best fits your current approach.",
    options: [
      "Mostly online",
      "Mostly offline",
      "Both online & offline",
      "Word of mouth / referrals",
      "Not generating leads actively",
      "Other",
    ],
  },
  {
    title: "What are your top 3 business goals for the next 6 months?",
    subtitle: "Pick the goals that matter most to you.",
    options: [
      "Get more leads",
      "Increase revenue",
      "Build brand awareness",
      "Launch a new product/service",
      "Improve online presence",
      "Reduce customer acquisition cost",
      "Expand to new locations",
      "Automate operations",
    ],
  },
  {
    title: "What is your biggest challenge in growing your business right now?",
    subtitle: "Select the one that resonates the most.",
    options: [
      "Not enough leads or enquiries",
      "Low brand visibility online",
      "No time for marketing",
      "Don't know what works",
      "High competition in my area",
      "Budget constraints",
    ],
  },
  {
    title: "What is your average monthly revenue range?",
    subtitle: "This helps us tailor recommendations. (Optional)",
    options: [
      "Below ₹5 Lakhs",
      "₹5 – ₹15 Lakhs",
      "₹15 – ₹50 Lakhs",
      "₹50 Lakhs – ₹1 Crore",
      "₹1 Crore – ₹5 Crore",
      "Above ₹5 Crore",
      "Prefer not to say",
    ],
  },
  {
    title: "What is your current monthly marketing budget range?",
    subtitle: "Select the range closest to your current spend.",
    options: [
      "No budget yet",
      "Below ₹10,000",
      "₹10,000 – ₹25,000",
      "₹25,000 – ₹50,000",
      "₹50,000 – ₹1 Lakh",
      "Above ₹1 Lakh",
    ],
  },
  {
    title: "How many leads or sales do you generate per month currently?",
    subtitle: "An estimate is fine — this helps us gauge your starting point.",
    options: [
      "0 – 10",
      "10 – 50",
      "50 – 100",
      "100 – 500",
      "500+",
      "Not sure",
    ],
  },
];

function ArrowLeft() {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 10.4142 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5H1M1 5L5 1M1 5L5 9"
        stroke="#004C43"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      className={styles.arrowIcon}
      viewBox="0 0 10.4142 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5H9M9 5L5 1M9 5L5 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function DigitalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const totalQuestions = quizData.length;
  const question = quizData[currentQuestion];
  const selectedOption = answers[currentQuestion] || null;

  const handleSelect = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const leftOptions = question.options.filter((_, i) => i % 2 === 0);
  const rightOptions = question.options.filter((_, i) => i % 2 === 1);
  const questionLabel = `Question ${String(currentQuestion + 1).padStart(2, "0")} / ${totalQuestions}`;

  return (
    <section className={`${styles.section} ${anekTamil.className}`}>
      <div className={styles.left} data-aos="fade-up">
        <span className={styles.badge}>Free Digital Quiz</span>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            How Digitally Ready Is{" "}
            <span className={styles.titleHighlight}>Your Business?</span>
          </h2>
          <p className={styles.subtitle}>
            Most SME owners don&apos;t know what&apos;s costing them customers
            online. Find out in 60 seconds.
          </p>
        </div>
      </div>

      <div className={styles.card} data-aos="fade-left">
        <div className={styles.cardHeader}>
          <span className={styles.questionCount}>
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <div className={styles.progressDots}>
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <span
                key={i}
                className={
                  i <= currentQuestion ? styles.dotActive : styles.dot
                }
              />
            ))}
          </div>
        </div>

        <div className={styles.questionBody}>
          <div className={styles.questionMeta}>
            <span className={styles.questionLabel}>{questionLabel}</span>
            <div>
              <h3 className={styles.questionTitle}>{question.title}</h3>
              <p className={styles.questionSubtitle}>{question.subtitle}</p>
            </div>
          </div>

          <div className={styles.optionsGrid}>
            <div className={styles.optionsColumn}>
              {leftOptions.map((option) => (
                <button
                  key={option}
                  className={`${styles.option} ${
                    selectedOption === option ? styles.optionSelected : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  type="button"
                >
                  <span
                    className={`${styles.checkbox} ${
                      selectedOption === option ? styles.checkboxSelected : ""
                    }`}
                  >
                    {selectedOption === option && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </span>
                  <span className={styles.optionText}>{option}</span>
                </button>
              ))}
            </div>
            <div className={styles.optionsColumn}>
              {rightOptions.map((option) => (
                <button
                  key={option}
                  className={`${styles.option} ${
                    selectedOption === option ? styles.optionSelected : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  type="button"
                >
                  <span
                    className={`${styles.checkbox} ${
                      selectedOption === option ? styles.checkboxSelected : ""
                    }`}
                  >
                    {selectedOption === option && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </span>
                  <span className={styles.optionText}>{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBack}
            disabled={currentQuestion === 0}
            style={{ opacity: currentQuestion === 0 ? 0.4 : 1 }}
          >
            <ArrowLeft />
            Back
          </button>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={currentQuestion === totalQuestions - 1}
          >
            {currentQuestion === totalQuestions - 1 ? "Submit" : "Next"}
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
