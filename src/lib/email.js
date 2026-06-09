// Helpers for reading email addresses out of env vars that may carry a display
// name, e.g. `ZEPTO_FROM_NO_REPLY="Brand Name <sender@example.com>"`.
// CC/BCC/To vars may also be comma-separated lists of such entries.

// Parse `Display Name <email@domain>` (or a bare address) into the
// { address, name } shape ZeptoMail expects. Returns null for empty input.
export function parseEmailAddress(raw) {
  const value = String(raw || "").trim();
  if (!value) return null;
  const match = value.match(/^(.*?)\s*<\s*([^>]+?)\s*>$/);
  if (match) {
    const name = match[1].replace(/^["']|["']$/g, "").trim();
    const address = match[2].trim();
    return name ? { address, name } : { address };
  }
  return { address: value };
}

// Turn a comma-separated env value into ZeptoMail's recipient array
// (`[{ email_address: { address, name } }]`). Returns undefined when empty.
export function toRecipients(value) {
  if (!value) return undefined;
  const list = String(value)
    .split(",")
    .map((part) => parseEmailAddress(part))
    .filter(Boolean)
    .map((email_address) => ({ email_address }));
  return list.length ? list : undefined;
}
