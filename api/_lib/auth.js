const crypto = require("crypto");

const COOKIE_NAME = "admin_session";
const SESSION_DAYS = Number(process.env.ADMIN_SESSION_DAYS || 90);

function getSecret() {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error("Configure ADMIN_SESSION_SECRET.");
  }

  return process.env.ADMIN_SESSION_SECRET;
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";

  return header.split(";").reduce((cookies, item) => {
    const [name, ...valueParts] = item.trim().split("=");
    if (!name) return cookies;

    cookies[name] = decodeURIComponent(valueParts.join("="));
    return cookies;
  }, {});
}

function createSessionToken() {
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(JSON.stringify({
    iat: now,
    exp: now + SESSION_DAYS * 24 * 60 * 60
  }));

  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token) {
  if (!token || !token.includes(".")) return false;

  const [payload, signature] = token.split(".");
  const expectedSignature = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch (error) {
    return false;
  }
}

function isAdminRequest(req) {
  const cookies = parseCookies(req);
  return verifySessionToken(cookies[COOKIE_NAME]);
}

function getSessionCookie() {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL ? "; Secure" : "";

  return `${COOKIE_NAME}=${encodeURIComponent(createSessionToken())}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

function getClearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL ? "; Secure" : "";

  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

function isValidPassword(password) {
  if (!process.env.ADMIN_PASSWORD) {
    throw new Error("Configure ADMIN_PASSWORD.");
  }

  const passwordHash = crypto.createHash("sha256").update(String(password || "")).digest();
  const expectedHash = crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest();

  return crypto.timingSafeEqual(passwordHash, expectedHash);
}

module.exports = {
  getClearSessionCookie,
  getSessionCookie,
  isAdminRequest,
  isValidPassword,
  SESSION_DAYS
};
