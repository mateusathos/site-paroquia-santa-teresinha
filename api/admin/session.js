const { isAdminRequest } = require("../_lib/auth");
const { sendJson, setAllowedMethods } = require("../_lib/http");

module.exports = async function handler(req, res) {
  setAllowedMethods(res, ["GET"]);

  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Metodo nao permitido." });
  }

  return sendJson(res, 200, { authenticated: isAdminRequest(req) });
};
