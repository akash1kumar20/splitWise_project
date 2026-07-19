/* eslint-env node */
// netlify/functions/parseExpense.js
// Standard Netlify Function (Node.js) — process.env works correctly here.
// Edge Functions use Deno runtime where process.env doesn't exist.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let text, users, categories;
  try {
    ({ text, users, categories } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  if (!text || !users || !categories) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing fields" }),
    };
  }

  const userNames = users.map((u) => u.userName).join(", ");

  const prompt = `You are a helpful expense parser for a split expense app used in India.

Users in this sheet: ${userNames}
Available categories: ${categories.join(", ")}
Payment methods: Cash, Upi, Card

User typed: "${text}"

Extract the expense details and respond with ONLY a valid JSON object — no explanation, no markdown, no extra text.

Rules:
- "user" must exactly match one of the user names above (case-sensitive). If unclear, pick the first user.
- "category" must exactly match one of the available categories above.
- "payBy" must be exactly "Cash", "Upi", or "Card". Default to "Cash" if not mentioned.
- "amount" must be a number (no currency symbol).
- "note" is a short description. Use "NA" if nothing specific mentioned.

Respond with exactly this JSON structure:
{
  "user": "Name",
  "category": "Category Name",
  "amount": 500,
  "payBy": "Cash",
  "note": "short note"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 256,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text?.trim();
    const parsed = JSON.parse(raw);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to parse expense. Try again." }),
    };
  }
};
