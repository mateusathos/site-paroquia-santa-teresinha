const { getClearSessionCookie } = require("../_lib/auth");
const { sendJson, setAllowedMethods } = require("../_lib/http");

module.exports = async function handler(req, res) {
  setAllowedMethods(res, ["POST"]);

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Metodo nao permitido." });
  }

  res.setHeader("Set-Cookie", getClearSessionCookie());
  return sendJson(res, 200, { ok: true });
};
