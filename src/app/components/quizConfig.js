export const quizData = [
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
      { label: "Generate more leads consistently", value: "more_leads", score: 4 },
      { label: "Build a stronger brand & reputation", value: "brand", score: 3 },
      { label: "Increase monthly revenue by 30–50%", value: "revenue", score: 4 },
      { label: "Automate follow-ups & lead management", value: "automate", score: 3 },
      { label: "Expand to a new city or market", value: "expand", score: 3 },
      { label: "Start selling online / e-commerce", value: "online_sales", score: 4 },
    ],
  },
  {
    key: "challenge",
    title: "What is your biggest challenge in growing your business right now?",
    subtitle: "Pick the one that keeps you up at night.",
    required: true,
    options: [
      { label: "Not getting enough leads or inquiries", value: "no_leads", score: 2 },
      { label: "Prospects don't trust us online", value: "no_trust", score: 3 },
      { label: "Losing customers to digital-first competitors", value: "competition", score: 2 },
      { label: "No time to manage digital marketing ourselves", value: "time", score: 3 },
      { label: "Marketing spend with no clear ROI", value: "roi", score: 4 },
      { label: "Something else entirely", value: "other", score: 2 },
    ],
  },
  {
    key: "ads",
    title: "Do you run paid ads on social media or Google?",
    subtitle: "Boosted posts count too.",
    required: true,
    options: [
      { label: "Yes - Google Ads + Meta Ads regularly", value: "google_meta", score: 10 },
      { label: "Yes - only Meta (Instagram / Facebook)", value: "meta_only", score: 6 },
      { label: "Yes - only Google Ads", value: "google_only", score: 7 },
      { label: "Tried before, didn't see results", value: "tried", score: 3 },
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
      { label: "Word of mouth / Referrals", value: "referral", score: 3 },
      { label: "Walk-ins / Footfall", value: "walkin", score: 2 },
      { label: "Online (website, SEO, ads)", value: "online", score: 8 },
      { label: "Social media DMs / posts", value: "social", score: 5 },
      { label: "Events / Expos / Networking", value: "events", score: 3 },
    ],
  },
  {
    key: "website",
    title: "Do you currently have a business website?",
    subtitle: "Be honest - even a basic one counts.",
    required: true,
    options: [
      { label: "Yes - it's active, looks good, and gets traffic", value: "yes_good", score: 10 },
      { label: "Yes - but it's outdated or rarely gets visitors", value: "yes_basic", score: 5 },
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
    subtitle: "Include everything - ads, agency fees, tools, content.",
    required: true,
    options: [
      { label: "Zero - no marketing budget currently", value: "zero", score: 0 },
      { label: "Under ₹10,000 / month", value: "under10k", score: 3 },
      { label: "₹10,000 – ₹30,000 / month", value: "10to30k", score: 6 },
      { label: "₹30,000 – ₹75,000 / month", value: "30to75k", score: 8 },
      { label: "Above ₹75,000 / month", value: "above75k", score: 10 },
    ],
  },
  {
    key: "monthly_leads",
    title: "How many leads or sales do you generate per month currently?",
    subtitle: "A lead = any inquiry, call, form fill, or walk-in with purchase intent.",
    required: true,
    options: [
      { label: "Fewer than 10 leads / month", value: "under10", score: 2 },
      { label: "10 – 30 leads / month", value: "10to30", score: 4 },
      { label: "30 – 100 leads / month", value: "30to100", score: 6 },
      { label: "More than 100 leads / month", value: "above100", score: 8 },
    ],
  },
];

export const PILLARS = {
  digital_presence: { keys: ["website", "social"], label: "Digital Presence", max: 20 },
  marketing: { keys: ["ads", "budget"], label: "Marketing Activity", max: 20 },
  lead_generation: { keys: ["leads_source", "monthly_leads"], label: "Lead Generation", max: 20 },
  strategy: { keys: ["goals", "challenge"], label: "Growth Strategy", max: 20 },
  business_stage: { keys: ["industry", "revenue"], label: "Business Readiness", max: 20 },
};

export const TIME_SLOTS = [
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "3:00 PM",
  "4:30 PM",
  "6:00 PM",
];

export function computeScore(answers) {
  const pillarScores = {};
  let total = 0;
  for (const [pid, pillar] of Object.entries(PILLARS)) {
    let pillarTotal = 0;
    pillar.keys.forEach((k) => {
      if (answers[k]) pillarTotal += answers[k].score || 0;
    });
    const capped = Math.min(pillarTotal, pillar.max);
    pillarScores[pid] = { label: pillar.label, score: capped, max: pillar.max };
    total += capped;
  }
  return { total: Math.min(total, 100), pillars: pillarScores };
}

export function getGrade(total) {
  if (total < 35)
    return {
      className: "gradeLow",
      text: "⚠️ Needs Urgent Attention",
      headline: "Your business is largely invisible online.",
      subline:
        "There are major revenue gaps - but the upside is massive with the right moves.",
    };
  if (total < 60)
    return {
      className: "gradeMid",
      text: "📈 Growing - But Leaking Revenue",
      headline: "You have a foundation, but critical gaps are costing you leads.",
      subline:
        "Fixing 2–3 key areas could double your inbound pipeline within 90 days.",
    };
  return {
    className: "gradeHigh",
    text: "🚀 Strong - Ready to Scale",
    headline: "You're ahead of 80% of Indian SMEs digitally.",
    subline:
      "The next step is building a scalable growth engine to compound your advantage.",
  };
}

export function buildEmailQuestions(answers) {
  return quizData.map((q) => {
    const ans = answers[q.key];
    if (!ans) return { title: q.title, answer: "Skipped", score: 0 };
    const values = Array.isArray(ans.value) ? ans.value : [ans.value];
    const labels = values.map((v) => {
      const opt = q.options.find((o) => o.value === v);
      return opt ? opt.label : v;
    });
    return { title: q.title, answer: labels.join(", "), score: ans.score };
  });
}
