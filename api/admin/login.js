const { getSessionCookie, isValidPassword, SESSION_DAYS } = require("../_lib/auth");
const { readJsonBody, sendJson, setAllowedMethods } = require("../_lib/http");

module.exports = async function handler(req, res) {
  setAllowedMethods(res, ["POST"]);

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Metodo nao permitido." });
  }

  try {
    const body = await readJsonBody(req);

    if (!isValidPassword(body.password)) {
      return sendJson(res, 401, { error: "Senha invalida." });
    }

    res.setHeader("Set-Cookie", getSessionCookie());
    return sendJson(res, 200, { ok: true, sessionDays: SESSION_DAYS });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Erro ao fazer login." });
  }
};
