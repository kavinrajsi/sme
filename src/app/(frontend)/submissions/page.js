import { cookies } from "next/headers";
import { Anek_Tamil } from "next/font/google";
import { query } from "@/lib/db";
import { isSessionValid, SESSION_COOKIE_NAME } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";
import { logoutAction } from "./actions";
import styles from "./page.module.css";

const anekTamil = Anek_Tamil({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Submissions · SearchMadarth",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ROW_LIMIT = 100;

async function fetchAll() {
  const types = ["demo", "quiz", "booking"];
  const [demoRes, quizRes, bookingRes] = await Promise.allSettled(
    types.map((type) =>
      query(
        "SELECT * FROM sme_submissions WHERE form_type = $1 ORDER BY created_at DESC LIMIT $2",
        [type, ROW_LIMIT],
      ),
    ),
  );
  return {
    demo: demoRes.status === "fulfilled" ? demoRes.value.rows : [],
    quiz: quizRes.status === "fulfilled" ? quizRes.value.rows : [],
    booking: bookingRes.status === "fulfilled" ? bookingRes.value.rows : [],
    errors: [demoRes, quizRes, bookingRes]
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason),
  };
}

function formatDateTime(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function emailSentChip(sent) {
  return (
    <span className={sent ? styles.chipOk : styles.chipPending}>
      {sent ? "sent" : "pending"}
    </span>
  );
}

function DemoTable({ rows }) {
  if (!rows.length) return <p className={styles.empty}>No demo submissions yet.</p>;
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Message</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{formatDateTime(r.created_at)}</td>
              <td>{r.details.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.details.company || "—"}</td>
              <td className={styles.messageCell}>{r.details.message || "—"}</td>
              <td>{emailSentChip(r.email_sent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuizTable({ rows }) {
  if (!rows.length) return <p className={styles.empty}>No quiz submissions yet.</p>;
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Score</th>
            <th>Pillars</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{formatDateTime(r.created_at)}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>
                <strong>{r.details.score}</strong> / 100
              </td>
              <td className={styles.pillarsCell}>
                {r.details.pillars
                  ? Object.values(r.details.pillars)
                      .map((p) => `${p.label}: ${p.score}/${p.max}`)
                      .join(", ")
                  : "—"}
              </td>
              <td>{emailSentChip(r.email_sent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookingTable({ rows }) {
  if (!rows.length) return <p className={styles.empty}>No booking submissions yet.</p>;
  return (
    <div className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Business</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Score</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{formatDateTime(r.created_at)}</td>
              <td>{r.details.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
              <td>{r.details.business || "—"}</td>
              <td>{r.details.booking_date}</td>
              <td>{r.details.slot}</td>
              <td>{r.details.score ?? "—"}</td>
              <td>{emailSentChip(r.email_sent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const authed = isSessionValid(sessionCookie);

  if (!authed) {
    return (
      <main className={`${styles.shell} ${anekTamil.className}`}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>SearchMadarth admin</h1>
          <p className={styles.loginSubtitle}>
            Enter the admin password to view form submissions.
          </p>
          <LoginForm />
        </div>
      </main>
    );
  }

  const { demo, quiz, booking, errors } = await fetchAll();

  return (
    <main className={`${styles.shell} ${anekTamil.className}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Form submissions</h1>
          <p className={styles.subtitle}>
            Latest {ROW_LIMIT} per table, newest first.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutBtn}>
            Sign out
          </button>
        </form>
      </header>

      {errors.length > 0 && (
        <div className={styles.errorBanner}>
          Some tables failed to load. Check server logs.
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Demo requests <span className={styles.sectionCount}>({demo.length})</span>
        </h2>
        <DemoTable rows={demo} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Quiz submissions{" "}
          <span className={styles.sectionCount}>({quiz.length})</span>
        </h2>
        <QuizTable rows={quiz} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Strategy-call bookings{" "}
          <span className={styles.sectionCount}>({booking.length})</span>
        </h2>
        <BookingTable rows={booking} />
      </section>
    </main>
  );
}
