const { isAdminRequest } = require("../_lib/auth");
const { ensureAvisosTable, getDb, rowToAviso } = require("../_lib/db");
const { readJsonBody, sendJson, setAllowedMethods } = require("../_lib/http");

function normalizeAvisoInput(body) {
  const titulo = String(body.titulo || "").trim();
  const descricao = String(body.descricao || "").trim();

  if (!titulo || !descricao) {
    throw new Error("Informe titulo e descricao.");
  }

  if (titulo.length > 140) {
    throw new Error("O titulo deve ter ate 140 caracteres.");
  }

  if (descricao.length > 2000) {
    throw new Error("A descricao deve ter ate 2000 caracteres.");
  }

  return { titulo, descricao };
}

module.exports = async function handler(req, res) {
  setAllowedMethods(res, ["GET", "POST", "PUT", "DELETE"]);

  if (!isAdminRequest(req)) {
    return sendJson(res, 401, { error: "Sessao invalida ou expirada." });
  }

  try {
    await ensureAvisosTable();
    const db = getDb();

    if (req.method === "GET") {
      const result = await db.execute(`
        SELECT id, titulo, descricao, ativo, criado_em, atualizado_em
        FROM avisos
        ORDER BY datetime(criado_em) DESC, id DESC
      `);

      return sendJson(res, 200, { avisos: result.rows.map(rowToAviso) });
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const aviso = normalizeAvisoInput(body);

      const result = await db.execute({
        sql: `
          INSERT INTO avisos (titulo, descricao)
          VALUES (?, ?)
          RETURNING id, titulo, descricao, ativo, criado_em, atualizado_em
        `,
        args: [aviso.titulo, aviso.descricao]
      });

      return sendJson(res, 201, { aviso: rowToAviso(result.rows[0]) });
    }

    if (req.method === "PUT") {
      const body = await readJsonBody(req);
      const id = Number(body.id);

      if (!Number.isInteger(id) || id <= 0) {
        return sendJson(res, 400, { error: "Aviso invalido." });
      }

      const aviso = normalizeAvisoInput(body);
      const ativo = body.ativo === undefined ? 1 : body.ativo ? 1 : 0;

      const result = await db.execute({
        sql: `
          UPDATE avisos
          SET titulo = ?, descricao = ?, ativo = ?, atualizado_em = CURRENT_TIMESTAMP
          WHERE id = ?
          RETURNING id, titulo, descricao, ativo, criado_em, atualizado_em
        `,
        args: [aviso.titulo, aviso.descricao, ativo, id]
      });

      if (!result.rows.length) {
        return sendJson(res, 404, { error: "Aviso nao encontrado." });
      }

      return sendJson(res, 200, { aviso: rowToAviso(result.rows[0]) });
    }

    if (req.method === "DELETE") {
      const body = await readJsonBody(req);
      const id = Number(body.id);

      if (!Number.isInteger(id) || id <= 0) {
        return sendJson(res, 400, { error: "Aviso invalido." });
      }

      await db.execute({
        sql: "DELETE FROM avisos WHERE id = ?",
        args: [id]
      });

      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: "Metodo nao permitido." });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Erro ao gerenciar avisos." });
  }
};
