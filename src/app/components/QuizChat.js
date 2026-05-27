"use client";

import { useState, useEffect, useRef } from "react";
import { Anek_Tamil } from "next/font/google";
import { sendQuizEmail } from "../actions/sendDemoEmail";
import {
  quizData,
  TIME_SLOTS,
  computeScore,
  getGrade,
  buildEmailQuestions,
} from "./quizConfig";
import styles from "./QuizChat.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

function BotAvatar() {
  return <span className={styles.botAvatar}>SM</span>;
}

function UserAvatar() {
  return <span className={styles.userAvatar} aria-hidden="true" />;
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function QuizChat() {
  const [phase, setPhase] = useState("quiz");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const scrollRef = useRef(null);
  const endRef = useRef(null);

  const totalQuestions = quizData.length;
  const question = quizData[currentQuestion];
  const { total: finalScore, pillars } = computeScore(answers);
  const grade = phase === "result" ? getGrade(finalScore) : null;
  const progressPct =
    phase === "result"
      ? 100
      : phase === "phone"
        ? (totalQuestions / totalQuestions) * 100
        : (currentQuestion / totalQuestions) * 100;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history.length, currentQuestion, phase, pendingSelection]);

  const advance = () => {
    if (currentQuestion === totalQuestions - 1) {
      setPhase("phone");
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
    setPendingSelection(null);
  };

  const handleSingleSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [question.key]: { value: option.value, score: option.score },
    }));
    setHistory((prev) => [
      ...prev,
      {
        kind: "qa",
        question: question.title,
        answerText: option.label,
      },
    ]);
    advance();
  };

  const handleMultiToggle = (option) => {
    const current = pendingSelection?.values || [];
    if (option.value === "none") {
      setPendingSelection({ values: ["none"], score: 0 });
      return;
    }
    const filtered = current.filter((v) => v !== "none");
    if (filtered.includes(option.value)) {
      const newValues = filtered.filter((v) => v !== option.value);
      const newScore = question.options
        .filter((o) => newValues.includes(o.value))
        .reduce((acc, o) => acc + o.score, 0);
      if (newValues.length === 0) {
        setPendingSelection(null);
      } else {
        setPendingSelection({ values: newValues, score: Math.min(newScore, 10) });
      }
    } else {
      if (question.max && filtered.length >= question.max) return;
      const newValues = [...filtered, option.value];
      const newScore = question.options
        .filter((o) => newValues.includes(o.value))
        .reduce((acc, o) => acc + o.score, 0);
      setPendingSelection({ values: newValues, score: Math.min(newScore, 10) });
    }
  };

  const handleMultiSubmit = () => {
    if (!pendingSelection) return;
    const labels = question.options
      .filter((o) => pendingSelection.values.includes(o.value))
      .map((o) => o.label);
    setAnswers((prev) => ({
      ...prev,
      [question.key]: {
        value: pendingSelection.values,
        score: pendingSelection.score,
      },
    }));
    setHistory((prev) => [
      ...prev,
      {
        kind: "qa",
        question: question.title,
        answerText: labels.join(", "),
      },
    ]);
    advance();
  };

  const handleSkip = () => {
    setHistory((prev) => [
      ...prev,
      {
        kind: "qa",
        question: question.title,
        answerText: "Skipped",
      },
    ]);
    advance();
  };

  const handlePhoneSubmit = () => {
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
    setHistory((prev) => [
      ...prev,
      { kind: "phone", phone: trimmed },
    ]);
    setPhase("result");
  };

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

  const handleRestart = () => {
    setPhase("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setHistory([]);
    setPendingSelection(null);
    setPhone("");
    setPhoneError("");
    setAnimatedScore(0);
    setShowBooking(false);
    setBookingDone(false);
    setSelectedSlot(null);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleBookingSubmit = () => {
    const name = document.getElementById("booking-name")?.value.trim();
    const phn = document.getElementById("booking-phone")?.value.trim();
    const date = document.getElementById("booking-date")?.value;
    if (!name || !phn || !date || !selectedSlot) {
      alert("Please fill in your name, number, date, and a time slot.");
      return;
    }
    setBookingDone(true);
  };

  const isOptionSelected = (option) => {
    if (!question?.multi) return false;
    return pendingSelection?.values?.includes(option.value) || false;
  };

  return (
    <div className={`${styles.chat} ${anekTamil.className}`}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <BotAvatar />
          <div className={styles.topbarText}>
            <span className={styles.topbarTitle}>Digital Score</span>
            <span className={styles.topbarSubtitle}>
              SearchMadarth&reg; Bot
            </span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.thread}>
          <div className={styles.botRow}>
            <BotAvatar />
            <div className={styles.botBubble}>
              <p>Hi! I&apos;m the SearchMadarth&reg; Bot.</p>
              <p>
                I&apos;ll ask 10 quick questions to benchmark your business&apos;s
                digital readiness. It takes about 60 seconds.
              </p>
            </div>
          </div>

          {history.map((item, i) => {
            if (item.kind === "phone") {
              return (
                <div key={`h-${i}`} className={styles.userRow}>
                  <div className={styles.userBubble}>+91 {item.phone}</div>
                  <UserAvatar />
                </div>
              );
            }
            return (
              <div key={`h-${i}`}>
                <div className={styles.botRow}>
                  <BotAvatar />
                  <div className={styles.botBubble}>{item.question}</div>
                </div>
                <div className={styles.userRow}>
                  <div className={styles.userBubble}>{item.answerText}</div>
                  <UserAvatar />
                </div>
              </div>
            );
          })}

          {phase === "quiz" && question && (
            <div className={styles.botRow}>
              <BotAvatar />
              <div className={styles.botBubble}>
                <div className={styles.questionMeta}>
                  <span className={styles.questionCount}>
                    Question {currentQuestion + 1} of {totalQuestions}
                  </span>
                  {!question.required && (
                    <span className={styles.optionalChip}>Optional</span>
                  )}
                </div>
                <p className={styles.questionTitle}>{question.title}</p>
                {question.subtitle && (
                  <p className={styles.questionSubtitle}>{question.subtitle}</p>
                )}
                {question.multi && (
                  <p className={styles.multiHint}>
                    {question.max
                      ? `Select up to ${question.max}`
                      : "Select all that apply"}
                  </p>
                )}

                <div
                  className={`${styles.options} ${question.grid ? styles.optionsGrid : ""}`}
                >
                  {question.options.map((opt) => {
                    const selected = isOptionSelected(opt);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`${styles.optionChip} ${selected ? styles.optionChipSelected : ""}`}
                        onClick={() =>
                          question.multi
                            ? handleMultiToggle(opt)
                            : handleSingleSelect(opt)
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {(question.multi || !question.required) && (
                  <div className={styles.bubbleActions}>
                    {!question.required && (
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={handleSkip}
                      >
                        Skip
                      </button>
                    )}
                    {question.multi && (
                      <button
                        type="button"
                        className={styles.sendBtn}
                        onClick={handleMultiSubmit}
                        disabled={!pendingSelection}
                      >
                        Send
                        <SendIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === "phone" && (
            <div className={styles.botRow}>
              <BotAvatar />
              <div className={styles.botBubble}>
                <p className={styles.questionTitle}>
                  Almost there! Share your phone number.
                </p>
                <p className={styles.questionSubtitle}>
                  We&apos;ll send your detailed report on WhatsApp.
                </p>
                <form
                  className={styles.phoneForm}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePhoneSubmit();
                  }}
                >
                  <div className={styles.phoneInputWrap}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input
                      className={`${styles.phoneInput} ${phoneError ? styles.phoneInputError : ""}`}
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setPhone(digits);
                        if (phoneError) setPhoneError("");
                      }}
                      autoFocus
                    />
                    <button type="submit" className={styles.sendBtn}>
                      Send
                      <SendIcon />
                    </button>
                  </div>
                  {phoneError && (
                    <span className={styles.phoneError}>{phoneError}</span>
                  )}
                </form>
              </div>
            </div>
          )}

          {phase === "result" && grade && (
            <div className={styles.botRow}>
              <BotAvatar />
              <div className={`${styles.botBubble} ${styles.resultBubble}`}>
                <div className={styles.resultScoreWrap}>
                  <div className={styles.resultScore}>
                    <span className={styles.resultScoreNum}>
                      {animatedScore}
                    </span>
                    <span className={styles.resultScoreDenom}>/100</span>
                  </div>
                  <div
                    className={`${styles.resultGrade} ${styles[grade.className]}`}
                  >
                    {grade.text}
                  </div>
                </div>
                <p className={styles.resultHeadline}>{grade.headline}</p>
                <p className={styles.resultSubline}>{grade.subline}</p>

                <div className={styles.breakdown}>
                  <div className={styles.breakdownTitle}>
                    Your 5 Growth Pillars
                  </div>
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

                <div className={styles.resultCta}>
                  <p className={styles.resultCtaTitle}>
                    Book a free 30-min strategy call
                  </p>
                  <p className={styles.resultCtaText}>
                    Our growth experts will walk you through your score and
                    hand you a personalised action plan.
                  </p>
                  <div className={styles.resultActions}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={() => setShowBooking(true)}
                    >
                      Book Free Call
                    </button>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={handleRestart}
                    >
                      Retake the quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      <div className={styles.composer}>
        <div className={styles.composerInner}>
          <span className={styles.composerHint}>
            {phase === "quiz"
              ? "Tap an answer above to continue"
              : phase === "phone"
                ? "Enter your phone number above"
                : "Your Digital Score is ready"}
          </span>
        </div>
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
                  Book your free strategy call
                </h4>
                <p className={styles.modalSubtitle}>
                  30 minutes. Zero obligation. Real insights.
                </p>
              </div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShowBooking(false)}
                aria-label="Close"
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
                    className={styles.primaryBtn}
                    style={{ width: "100%" }}
                    onClick={handleBookingSubmit}
                  >
                    Confirm my free call
                  </button>
                </>
              ) : (
                <div className={styles.bookingSuccess}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3 className={styles.successTitle}>You&apos;re booked!</h3>
                  <p className={styles.successText}>
                    We&apos;ll send a confirmation to your WhatsApp shortly.
                    Our growth expert will call you at your chosen time.
                  </p>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    onClick={() => setShowBooking(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
