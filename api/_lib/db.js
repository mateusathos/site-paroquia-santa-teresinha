const { createClient } = require("@libsql/client");

let client;
let setupPromise;

function getDb() {
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    throw new Error("Configure TURSO_DATABASE_URL e TURSO_AUTH_TOKEN.");
  }

  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN
    });
  }

  return client;
}

async function ensureAvisosTable() {
  if (!setupPromise) {
    setupPromise = getDb().execute(`
      CREATE TABLE IF NOT EXISTS avisos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        ativo INTEGER NOT NULL DEFAULT 1,
        criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  return setupPromise;
}

function rowToAviso(row) {
  return {
    id: Number(row.id),
    titulo: row.titulo,
    descricao: row.descricao,
    ativo: Boolean(row.ativo),
    criado_em: row.criado_em,
    atualizado_em: row.atualizado_em
  };
}

module.exports = {
  ensureAvisosTable,
  getDb,
  rowToAviso
};
