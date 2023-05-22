# Spacetime API

Este repositório contém o backend do projeto full-stack [Spacetime](https://github.com/LucasLuccaCode/spacetime-next). Esta api implementa autenticação oauth com o GitHub, e gerencia as memórias armazenadas no banco de dados. Construída com Fastify, TypeScript e SQLite como banco de dados.

## Instalação

Clone o repositório:

```bash
git clone git@github.com:LucasLuccaCode/spacetime-fastify.git
```

Navegue até o diretório do projeto:

```bash
cd spacetime-fastify
```

Instale as dependências:

```bash
npm install
```

## Configuração do banco de dados sqlite

Antes de executar o projeto, certifique-se de executar as migrations para criar as tabelas necessárias no banco de dados sqlite:

```bash
npx prisma migrate dev
```

Renomeie o arquivo `.env.example` para `.env`, e defina as variáveis de ambiente com seus respectivos valores:

```makefile
#GitHub
GITHUB_CLIENT_ID=seu-client-id-do-github
GITHUB_CLIENT_SECRET=seu-client-secret-do-github

#JWT
JWT_SECRET=sua-chave-secreta-de-assinatura-dos-tokens-jwt
```

## Inicie a api para acessar ela em http://localhost:3333:

```bash
npm run dev
```

## Rotas da API

- Memórias:
  - `GET /memories` Recupera uma lista de memórias.
  - `POST /memories` Cria uma nova memória.
  - `GET /memories/:id` Recupera uma memória específica pelo seu ID.
  - `PUT /memories/:id` Atualiza uma memória existente.
  - `DELETE /memories/:id` Deleta uma memória.
  - `POST /upload` Salva a mídia enviada na criação de uma nova memória.

- Usuário:
  - `POST /register` Cadastra um novo usuário com os dados do github.

## Front-end
[Clique aqui](https://github.com/LucasLuccaCode/spacetime-next) para acessar o repositório contendo a interface do Spacetime.

## Tecnologias usadas

- Fastify
- Typescript
- Prisma
- SQLite
- Fastify Multipart
- Fastify JWT
- Eslint
- Dotenv
- Zod
- Axios