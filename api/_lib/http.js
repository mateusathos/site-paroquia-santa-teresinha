function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Payload muito grande."));
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("JSON invalido."));
      }
    });

    req.on("error", reject);
  });
}

function setAllowedMethods(res, methods) {
  res.setHeader("Allow", methods.join(", "));
}

module.exports = {
  readJsonBody,
  sendJson,
  setAllowedMethods
};
