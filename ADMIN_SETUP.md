# Painel administrativo

Este projeto usa Vercel Functions e Turso para gerenciar os avisos paroquiais.

## Variaveis de ambiente

Configure estas variaveis no projeto da Vercel:

```env
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu_token_do_turso
ADMIN_PASSWORD=senha_do_administrador
ADMIN_SESSION_SECRET=uma_chave_longa_e_aleatoria
ADMIN_SESSION_DAYS=90
```

`ADMIN_SESSION_DAYS` e opcional. Se nao for informado, a sessao dura 90 dias.

## Banco de dados

A tabela `avisos` e criada automaticamente na primeira chamada da API. O schema usado e:

```sql
CREATE TABLE IF NOT EXISTS avisos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Para cadastrar o aviso que ja existia no HTML antigo:

```sql
INSERT INTO avisos (titulo, descricao)
VALUES (
  'Missas na Comunidade Nossa Senhora de Guadalupe',
  'Informamos que a partir de Janeiro, em todos os sábados, haverá Santa Missa na Comunidade Nossa Senhora de Guadalupe às 17:30.'
);
```

## Acessos

- Pagina publica: `/avisos`
- Painel administrativo: `/admin`

O login cria um cookie HTTP-only assinado. Para encerrar a sessao, use o botao `Sair`. Para invalidar todas as sessoes antigas, troque o valor de `ADMIN_SESSION_SECRET` na Vercel.
