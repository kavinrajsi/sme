"use client";

import { useState, useEffect } from "react";
import { Anek_Tamil } from "next/font/google";
import styles from "./DigitalQuiz.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const quizData = [
  {
    key: "industry",
    title: "What industry is your business in?",
    subtitle: "Select the option that best describes your business.",
    required: true,
    grid: true,
    options: [
      { label: "Retail / E-commerce", value: "retail", score: 5 },
      { label: "Food & Hospitality", value: "food", score: 4 },
      { label: "Healthcare / Clinic", value: "healthcare", score: 6 },
      { label: "Education / Coaching", value: "education", score: 5 },
      { label: "Real Estate", value: "realestate", score: 7 },
      { label: "Professional Services", value: "services", score: 6 },
      { label: "Manufacturing", value: "manufacturing", score: 4 },
      { label: "Other", value: "other", score: 4 },
    ],
  },
  {
    key: "goals",
    title: "What are your top business goals for the next 6 months?",
    subtitle: "Pick up to 3 that matter most to you right now.",
    required: true,
    multi: true,
    max: 3,
    options: [
      {
        label: "Generate more leads consistently",
        value: "more_leads",
        score: 4,
      },
      {
        label: "Build a stronger brand & reputation",
        value: "brand",
        score: 3,
      },
      {
        label: "Increase monthly revenue by 30–50%",
        value: "revenue",
        score: 4,
      },
      {
        label: "Automate follow-ups & lead management",
        value: "automate",
        score: 3,
      },
      {
        label: "Expand to a new city or market",
        value: "expand",
        score: 3,
      },
      {
        label: "Start selling online / e-commerce",
        value: "online_sales",
        score: 4,
      },
    ],
  },
  {
    key: "challenge",
    title:
      "What is your biggest challenge in growing your business right now?",
    subtitle: "Pick the one that keeps you up at night.",
    required: true,
    options: [
      {
        label: "Not getting enough leads or inquiries",
        value: "no_leads",
        score: 2,
      },
      {
        label: "Prospects don't trust us online",
        value: "no_trust",
        score: 3,
      },
      {
        label: "Losing customers to digital-first competitors",
        value: "competition",
        score: 2,
      },
      {
        label: "No time to manage digital marketing ourselves",
        value: "time",
        score: 3,
      },
      {
        label: "Marketing spend with no clear ROI",
        value: "roi",
        score: 4,
      },
      {
        label: "Something else entirely",
        value: "other",
        score: 2,
      },
    ],
  },
  {
    key: "ads",
    title: "Do you run paid ads on social media or Google?",
    subtitle: "Boosted posts count too.",
    required: true,
    options: [
      {
        label: "Yes — Google Ads + Meta Ads regularly",
        value: "google_meta",
        score: 10,
      },
      {
        label: "Yes — only Meta (Instagram / Facebook)",
        value: "meta_only",
        score: 6,
      },
      { label: "Yes — only Google Ads", value: "google_only", score: 7 },
      {
        label: "Tried before, didn't see results",
        value: "tried",
        score: 3,
      },
      { label: "No paid ads at all", value: "no", score: 0 },
    ],
  },
  {
    key: "leads_source",
    title: "How do you currently generate leads?",
    subtitle: "Select all that apply to your business today.",
    required: true,
    multi: true,
    options: [
      {
        label: "Word of mouth / Referrals",
        value: "referral",
        score: 3,
      },
      { label: "Walk-ins / Footfall", value: "walkin", score: 2 },
      {
        label: "Online (website, SEO, ads)",
        value: "online",
        score: 8,
      },
      {
        label: "Social media DMs / posts",
        value: "social",
        score: 5,
      },
      {
        label: "Events / Expos / Networking",
        value: "events",
        score: 3,
      },
    ],
  },
  {
    key: "website",
    title: "Do you currently have a business website?",
    subtitle: "Be honest — even a basic one counts.",
    required: true,
    options: [
      {
        label: "Yes — it's active, looks good, and gets traffic",
        value: "yes_good",
        score: 10,
      },
      {
        label: "Yes — but it's outdated or rarely gets visitors",
        value: "yes_basic",
        score: 5,
      },
      { label: "Currently building one", value: "building", score: 3 },
      { label: "No website at all", value: "no", score: 0 },
    ],
  },
  {
    key: "social",
    title: "Are you active on social media platforms?",
    subtitle: "Select all that apply.",
    required: true,
    multi: true,
    grid: true,
    options: [
      { label: "Instagram", value: "instagram", score: 5 },
      { label: "Facebook", value: "facebook", score: 4 },
      { label: "LinkedIn", value: "linkedin", score: 5 },
      { label: "YouTube", value: "youtube", score: 6 },
      { label: "WhatsApp Business", value: "whatsapp", score: 3 },
      { label: "Not active on any", value: "none", score: 0 },
    ],
  },
  {
    key: "revenue",
    title: "What is your average monthly revenue range?",
    subtitle: "This helps us suggest the right-sized growth plan for you.",
    required: false,
    options: [
      { label: "Under ₹5 Lakhs / month", value: "under5", score: 2 },
      { label: "₹5L – ₹20L / month", value: "5to20", score: 4 },
      { label: "₹20L – ₹50L / month", value: "20to50", score: 6 },
      { label: "Above ₹50L / month", value: "above50", score: 8 },
    ],
  },
  {
    key: "budget",
    title: "What is your current monthly marketing budget range?",
    subtitle: "Include everything — ads, agency fees, tools, content.",
    required: true,
    options: [
      {
        label: "Zero — no marketing budget currently",
        value: "zero",
        score: 0,
      },
      { label: "Under ₹10,000 / month", value: "under10k", score: 3 },
      {
        label: "₹10,000 – ₹30,000 / month",
        value: "10to30k",
        score: 6,
      },
      {
        label: "₹30,000 – ₹75,000 / month",
        value: "30to75k",
        score: 8,
      },
      {
        label: "Above ₹75,000 / month",
        value: "above75k",
        score: 10,
      },
    ],
  },
  {
    key: "monthly_leads",
    title: "How many leads or sales do you generate per month currently?",
    subtitle:
      "A lead = any inquiry, call, form fill, or walk-in with purchase intent.",
    required: true,
    options: [
      {
        label: "Fewer than 10 leads / month",
        value: "under10",
        score: 2,
      },
      { label: "10 – 30 leads / month", value: "10to30", score: 4 },
      { label: "30 – 100 leads / month", value: "30to100", score: 6 },
      {
        label: "More than 100 leads / month",
        value: "above100",
        score: 8,
      },
    ],
  },
];

const PILLARS = {
  digital_presence: {
    keys: ["website", "social"],
    label: "Digital Presence",
    max: 20,
  },
  marketing: {
    keys: ["ads", "budget"],
    label: "Marketing Activity",
    max: 20,
  },
  lead_generation: {
    keys: ["leads_source", "monthly_leads"],
    label: "Lead Generation",
    max: 20,
  },
  strategy: {
    keys: ["goals", "challenge"],
    label: "Growth Strategy",
    max: 20,
  },
  business_stage: {
    keys: ["industry", "revenue"],
    label: "Business Readiness",
    max: 20,
  },
};

const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "3:00 PM",
  "4:30 PM",
  "6:00 PM",
];

function computeScore(answers) {
  const pillarScores = {};
  let total = 0;
  for (const [pid, pillar] of Object.entries(PILLARS)) {
    let pillarTotal = 0;
    pillar.keys.forEach((k) => {
      if (answers[k]) pillarTotal += answers[k].score || 0;
    });
    const capped = Math.min(pillarTotal, pillar.max);
    pillarScores[pid] = {
      label: pillar.label,
      score: capped,
      max: pillar.max,
    };
    total += capped;
  }
  return { total: Math.min(total, 100), pillars: pillarScores };
}

function getGrade(total) {
  if (total < 35)
    return {
      className: "gradeLow",
      text: "⚠️ Needs Urgent Attention",
      headline: "Your business is largely invisible online.",
      subline:
        "There are major revenue gaps — but the upside is massive with the right moves.",
    };
  if (total < 60)
    return {
      className: "gradeMid",
      text: "📈 Growing — But Leaking Revenue",
      headline:
        "You have a foundation, but critical gaps are costing you leads.",
      subline:
        "Fixing 2–3 key areas could double your inbound pipeline within 90 days.",
    };
  return {
    className: "gradeHigh",
    text: "🚀 Strong — Ready to Scale",
    headline: "You're ahead of 80% of Indian SMEs digitally.",
    subline:
      "The next step is building a scalable growth engine to compound your advantage.",
  };
}

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
  const [phase, setPhase] = useState("quiz");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const totalQuestions = quizData.length;
  const question = quizData[currentQuestion];
  const answer = question ? answers[question.key] : null;

  const progressPct =
    phase === "result" ? 100 : (currentQuestion / totalQuestions) * 100;
  const canProceed = !question?.required || !!answer;

  const handleSingleSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [question.key]: { value: option.value, score: option.score },
    }));
  };

  const handleMultiSelect = (option) => {
    const current = answers[question.key];
    const currentValues = current ? current.value : [];
    const max = question.max;

    if (option.value === "none") {
      setAnswers((prev) => ({
        ...prev,
        [question.key]: { value: ["none"], score: 0 },
      }));
      return;
    }

    const filtered = currentValues.filter((v) => v !== "none");

    if (filtered.includes(option.value)) {
      const newValues = filtered.filter((v) => v !== option.value);
      if (newValues.length === 0) {
        setAnswers((prev) => {
          const next = { ...prev };
          delete next[question.key];
          return next;
        });
      } else {
        const newScore = question.options
          .filter((o) => newValues.includes(o.value))
          .reduce((acc, o) => acc + o.score, 0);
        setAnswers((prev) => ({
          ...prev,
          [question.key]: {
            value: newValues,
            score: Math.min(newScore, 10),
          },
        }));
      }
    } else {
      if (max && filtered.length >= max) return;
      const newValues = [...filtered, option.value];
      const newScore = question.options
        .filter((o) => newValues.includes(o.value))
        .reduce((acc, o) => acc + o.score, 0);
      setAnswers((prev) => ({
        ...prev,
        [question.key]: { value: newValues, score: Math.min(newScore, 10) },
      }));
    }
  };

  const isOptionSelected = (option) => {
    if (!answer) return false;
    if (question.multi) return answer.value.includes(option.value);
    return answer.value === option.value;
  };

  const handleNext = () => {
    if (currentQuestion === totalQuestions - 1) {
      setPhase("result");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (currentQuestion === totalQuestions - 1) {
      setPhase("result");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setPhase("quiz");
    setAnimatedScore(0);
    setShowBooking(false);
    setBookingDone(false);
    setSelectedSlot(null);
  };

  const handleBookingSubmit = () => {
    const name = document.getElementById("booking-name")?.value.trim();
    const phone = document.getElementById("booking-phone")?.value.trim();
    const date = document.getElementById("booking-date")?.value;
    if (!name || !phone || !date || !selectedSlot) {
      alert("Please fill in your name, number, date, and a time slot.");
      return;
    }
    setBookingDone(true);
  };

  const { total: finalScore, pillars } = computeScore(answers);
  const grade = getGrade(finalScore);
  const circumference = 2 * Math.PI * 60;

  useEffect(() => {
    if (phase !== "result") return;
    let count = 0;
    const id = setInterval(() => {
      count = Math.min(count + 2, finalScore);
      setAnimatedScore(count);
      if (count >= finalScore) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, [phase, finalScore]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const questionLabel = question
    ? `Question ${String(currentQuestion + 1).padStart(2, "0")} / ${totalQuestions}`
    : "";

  const renderOption = (opt) => {
    const selected = isOptionSelected(opt);
    const handleClick = question.multi ? handleMultiSelect : handleSingleSelect;
    return (
      <button
        key={opt.value}
        className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
        onClick={() => handleClick(opt)}
        type="button"
      >
        <span
          className={`${styles.checkbox} ${selected ? styles.checkboxSelected : ""}`}
        >
          {selected && <span className={styles.checkmark}>✓</span>}
        </span>
        <span className={styles.optionText}>{opt.label}</span>
      </button>
    );
  };

  const renderOptions = () => {
    if (!question) return null;

    if (question.grid) {
      const leftOptions = question.options.filter((_, i) => i % 2 === 0);
      const rightOptions = question.options.filter((_, i) => i % 2 === 1);
      return (
        <div className={styles.optionsGrid}>
          <div className={styles.optionsColumn}>
            {leftOptions.map(renderOption)}
          </div>
          <div className={styles.optionsColumn}>
            {rightOptions.map(renderOption)}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.optionsList}>{question.options.map(renderOption)}</div>
    );
  };

  return (
    <section className={`${styles.section} ${anekTamil.className}`} id="quiz">
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
        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {phase === "quiz" ? (
          <>
            {/* Card header */}
            <div className={styles.cardHeader}>
              <span className={styles.questionCount}>
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <div className={styles.progressDots}>
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < currentQuestion
                        ? styles.dotDone
                        : i === currentQuestion
                          ? styles.dotActive
                          : styles.dot
                    }
                  />
                ))}
              </div>
            </div>

            {/* Question body */}
            <div className={styles.questionBody}>
              <div className={styles.questionMeta}>
                <span className={styles.questionLabel}>
                  {questionLabel}
                  {!question.required && (
                    <span className={styles.optionalBadge}>OPTIONAL</span>
                  )}
                </span>
                <div>
                  <h3 className={styles.questionTitle}>{question.title}</h3>
                  <p className={styles.questionSubtitle}>
                    {question.subtitle}
                  </p>
                </div>
              </div>

              {question.multi && (
                <div className={styles.multiHint}>
                  ✦{" "}
                  {question.max
                    ? `Pick up to ${question.max}`
                    : "Multi-select"}
                </div>
              )}

              {renderOptions()}
            </div>

            {/* Card footer */}
            <div className={styles.cardFooter}>
              <div className={styles.footerLeft}>
                <button
                  type="button"
                  className="btn-base btn-ghost-teal"
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  style={{ opacity: currentQuestion === 0 ? 0.4 : 1 }}
                >
                  <ArrowLeft />
                  Back
                </button>
                {!question.required && (
                  <button
                    type="button"
                    className="btn-text"
                    onClick={handleSkip}
                  >
                    Skip
                  </button>
                )}
              </div>
              <button
                type="button"
                className="btn-base btn-solid-teal"
                onClick={handleNext}
                disabled={!canProceed}
                style={{ opacity: canProceed ? 1 : 0.4 }}
              >
                {currentQuestion === totalQuestions - 1
                  ? "See My Score"
                  : "Next"}
                <ArrowRight />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.resultScreen}>
            {/* Score header */}
            <div className={styles.resultTop}>
              <div className={styles.scoreRing}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="#CADB3F"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference -
                      (circumference * animatedScore) / 100
                    }
                    strokeLinecap="round"
                    style={{
                      transform: "rotate(-90deg)",
                      transformOrigin: "center",
                      transition: "stroke-dashoffset 0.1s ease",
                    }}
                  />
                </svg>
                <div className={styles.scoreInner}>
                  <div className={styles.scoreNum}>{animatedScore}</div>
                  <div className={styles.scoreDenom}>/100</div>
                </div>
              </div>
              <div
                className={`${styles.resultGrade} ${styles[grade.className]}`}
              >
                {grade.text}
              </div>
              <div className={styles.resultHeadline}>{grade.headline}</div>
              <div className={styles.resultSubline}>{grade.subline}</div>
            </div>

            {/* Breakdown */}
            <div className={styles.breakdownSection}>
              <div className={styles.breakdownTitle}>
                Score Breakdown — 5 Growth Pillars
              </div>
              <div className={styles.breakdownItems}>
                {Object.values(pillars).map((p) => {
                  const pct = Math.round((p.score / p.max) * 100);
                  const barClass =
                    pct < 35
                      ? styles.barRed
                      : pct < 65
                        ? styles.barYellow
                        : styles.barGreen;
                  return (
                    <div className={styles.breakdownItem} key={p.label}>
                      <span className={styles.breakdownLabel}>
                        {p.label}
                      </span>
                      <div className={styles.breakdownBarBg}>
                        <div
                          className={`${styles.breakdownBarFill} ${barClass}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={styles.breakdownScore}>
                        {p.score}/{p.max}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className={styles.resultCta}>
              <h4 className={styles.resultCtaTitle}>
                Book Your Free 30-Min Strategy Call
              </h4>
              <p className={styles.resultCtaText}>
                Our growth experts will walk you through your score and hand
                you a personalised action plan — at zero cost.
              </p>
              <button
                type="button"
                className="btn-base btn-solid-teal"
                onClick={() => setShowBooking(true)}
                style={{ margin: "0 auto" }}
              >
                📞 Book Free Call Now
              </button>
              <button
                type="button"
                className="btn-text"
                onClick={handleRestart}
                style={{ display: "block", width: "100%", textAlign: "center", marginTop: "16px" }}
              >
                ← Retake the quiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking modal */}
      {showBooking && (
        <div
          className={styles.modalOverlay}
          onClick={(e) =>
            e.target === e.currentTarget && setShowBooking(false)
          }
        >
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <h4 className={styles.modalTitle}>
                  Book Your Free Strategy Call
                </h4>
                <p className={styles.modalSubtitle}>
                  30 minutes. Zero obligation. Real insights.
                </p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShowBooking(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {!bookingDone ? (
                <>
                  <div className={styles.scorePill}>
                    <span className={styles.scorePillDot} />
                    Your Score: {finalScore} / 100
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Your Name</label>
                    <input
                      className={styles.formInput}
                      id="booking-name"
                      type="text"
                      placeholder="Eg: Rajesh Kumar"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Business Name</label>
                    <input
                      className={styles.formInput}
                      id="booking-biz"
                      type="text"
                      placeholder="Eg: Sharma Electronics"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      WhatsApp Number
                    </label>
                    <input
                      className={styles.formInput}
                      id="booking-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Date</label>
                    <input
                      className={styles.formInput}
                      id="booking-date"
                      type="date"
                      defaultValue={minDate}
                      min={minDate}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Preferred Time Slot
                    </label>
                    <div className={styles.timeSlots}>
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`${styles.timeSlot} ${selectedSlot === slot ? styles.timeSlotSelected : ""}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-submit"
                    onClick={handleBookingSubmit}
                  >
                    ✅ Confirm My Free Call →
                  </button>
                </>
              ) : (
                <div className={styles.bookingSuccess}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3 className={styles.successTitle}>
                    You&apos;re Booked!
                  </h3>
                  <p className={styles.successText}>
                    We&apos;ll send a confirmation to your WhatsApp shortly.
                    Our growth expert will call you at your chosen time.
                  </p>
                  <button
                    type="button"
                    className="btn-base btn-solid-teal"
                    onClick={() => setShowBooking(false)}
                    style={{ margin: "0 auto" }}
                  >
                    Done →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
