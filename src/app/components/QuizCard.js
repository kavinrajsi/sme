"use client";

import { useState, useEffect } from "react";
import { sendBookingEmail, sendQuizEmail } from "../actions/sendDemoEmail";
import {
  quizData,
  TIME_SLOTS,
  computeScore,
  getGrade,
  buildEmailQuestions,
} from "./quizConfig";
import styles from "./DigitalQuiz.module.css";

function ArrowLeft() {
  return (
    <svg
      className={styles.arrowIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
    >
      <path
        d="M10 5H2M6 9L2 5L6 1"
        stroke="currentColor"
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
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
    >
      <path
        d="M1 5H9M5 9L9 5L5 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function QuizCard({ className = "", id = "quiz", aos = "fade-left" }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("quiz");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

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
          [question.key]: { value: newValues, score: Math.min(newScore, 10) },
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
      setPhase("phone");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSkip = () => {
    if (currentQuestion === totalQuestions - 1) {
      setPhase("phone");
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePhoneSubmit = async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmed)) {
      setPhoneError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setPhoneError("");

    const { total, pillars: p } = computeScore(answers);
    sendQuizEmail({
      phone: trimmed,
      score: total,
      pillars: p,
      questions: buildEmailQuestions(answers),
    });

    setPhase("result");
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setPhase("quiz");
    setAnimatedScore(0);
    setShowBooking(false);
    setBookingDone(false);
    setSelectedSlot(null);
    setPhone("");
    setPhoneError("");
  };

  const handleBookingSubmit = () => {
    const name = document.getElementById("booking-name")?.value.trim();
    const business = document.getElementById("booking-biz")?.value.trim();
    const phoneVal = document.getElementById("booking-phone")?.value.trim();
    const date = document.getElementById("booking-date")?.value;
    if (!name || !phoneVal || !date || !selectedSlot) {
      alert("Please fill in your name, number, date, and a time slot.");
      return;
    }
    sendBookingEmail({
      name,
      business,
      phone: phoneVal,
      date,
      slot: selectedSlot,
      score: finalScore,
    });
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
    <>
      <div
        id={id}
        className={`${styles.card} ${className}`}
        data-aos={aos || undefined}
      >
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {phase === "phone" ? (
          <div className={styles.phoneScreen}>
            <div className={styles.phoneContent}>
              <h3 className={styles.questionTitle}>
                Almost there! Enter your phone number to see your score.
              </h3>
              <p className={styles.questionSubtitle}>
                We&apos;ll send your detailed report via WhatsApp.
              </p>
              <div className={styles.phoneInputWrap}>
                <input
                  className={`${styles.phoneInput} ${phoneError ? styles.phoneInputError : ""}`}
                  type="tel"
                  inputMode="numeric"
                  placeholder="Eg: 9876543210"
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(digits);
                    if (phoneError) setPhoneError("");
                  }}
                />
                {phoneError && (
                  <span className={styles.phoneError}>{phoneError}</span>
                )}
              </div>
              <button
                type="button"
                className="btn-base btn-solid-teal"
                onClick={handlePhoneSubmit}
                style={{ width: "100%" }}
              >
                See My Score
                <ArrowRight />
              </button>
            </div>
          </div>
        ) : phase === "quiz" ? (
          <>
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

            <div className={styles.questionBody}>
              <div className={styles.questionMeta}>
                {!question.required && (
                  <span className={styles.questionLabel}>
                    <span className={styles.optionalBadge}>OPTIONAL</span>
                  </span>
                )}
                <div>
                  <h3 className={styles.questionTitle}>{question.title}</h3>
                  <p className={styles.questionSubtitle}>{question.subtitle}</p>
                </div>
              </div>

              {question.multi && (
                <div className={styles.multiHint}>
                  ✦{" "}
                  {question.max ? `Pick up to ${question.max}` : "Multi-select"}
                </div>
              )}

              {renderOptions()}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.footerLeft}>
                <button
                  type="button"
                  className={`btn-base ${styles.prevBtn}`}
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
                className={`btn-base ${styles.nextBtn}`}
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
                      circumference - (circumference * animatedScore) / 100
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

            <div className={styles.breakdownSection}>
              <div className={styles.breakdownTitle}>
                Score Breakdown - 5 Growth Pillars
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
                      <span className={styles.breakdownLabel}>{p.label}</span>
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

            <div className={styles.resultCta}>
              <h4 className={styles.resultCtaTitle}>
                Book Your Free 30-Min Strategy Call
              </h4>
              <p className={styles.resultCtaText}>
                Our growth experts will walk you through your score and hand you
                a personalised action plan - at zero cost.
              </p>
              <button
                type="button"
                className="btn-base btn-solid-teal"
                onClick={() => setShowBooking(true)}
                style={{ margin: "0 auto" }}
              >
                Book Free Call Now
              </button>
              <button
                type="button"
                className="btn-text"
                onClick={handleRestart}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  marginTop: "16px",
                }}
              >
                ← Retake the quiz
              </button>
            </div>
          </div>
        )}
      </div>

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
                    <label className={styles.formLabel}>WhatsApp Number</label>
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
                  <h3 className={styles.successTitle}>You&apos;re Booked!</h3>
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
    </>
  );
}
