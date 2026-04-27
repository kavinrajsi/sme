const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// AI / answer-engine crawlers we explicitly opt-in. Naming each user-agent
// (instead of relying on the catch-all "*") is a positive AIO signal: some
// crawlers only honor allow rules when their UA is named, and it lets us
// revoke any one of them later by flipping its allow to a disallow.
const aiCrawlers = [
  "Google-Extended", // Google Gemini / Bard training
  "GPTBot", // OpenAI training crawler
  "ChatGPT-User", // OpenAI in-chat browsing fetch
  "OAI-SearchBot", // OpenAI SearchGPT index
  "ClaudeBot", // Anthropic Claude
  "Claude-Web", // Anthropic Claude in-chat fetch
  "anthropic-ai", // Anthropic legacy/alternate UA
  "PerplexityBot", // Perplexity index crawler
  "Perplexity-User", // Perplexity in-chat fetch
  "Applebot-Extended", // Apple Intelligence training opt-in
  "DuckAssistBot", // DuckDuckGo answer engine
  "CCBot", // Common Crawl (feeds many LLM training sets)
];

export default function robots() {
  const sitemap = siteUrl
    ? `${siteUrl.replace(/\/$/, "")}/sitemap.xml`
    : undefined;

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap,
  };
}
