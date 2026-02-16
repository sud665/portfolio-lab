import https from "node:https";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export function sendTelegramMessage(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    });

    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: "POST",
        family: 4,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => resolve(res.statusCode === 200)
    );

    req.on("error", () => resolve(false));
    req.write(payload);
    req.end();
  });
}

export function verifyTelegramWebhook(
  secretToken: string | null
): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !secretToken) return false;
  return secretToken === expected;
}
