import crypto from "crypto";

/**
 * LINE signature ต้อง HMAC-SHA256 ด้วย Channel Secret ของ "raw body"
 * แล้ว base64 เทียบกับ x-line-signature
 */
export function computeSignature(rawBody, channelSecret) {
  return crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
}

export function verifyLineSignature(rawBody, signature, channelSecret) {
  if (!signature) return false;
  const hash = computeSignature(rawBody, channelSecret);

  // timing-safe compare
  const a = Buffer.from(hash);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
