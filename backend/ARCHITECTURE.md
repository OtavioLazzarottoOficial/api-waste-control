# Documentação da Arquitetura e Rotas (API Waste Control)

Este documento descreve a arquitetura, as tecnologias e a estrutura de rotas do projeto **Waste Control**, desenvolvido em Node.js com o framework **NestJS**. O objetivo da API é controlar o desperdício de alimentos em restaurantes.

---

## 🚀 Tecnologias Utilizadas

A aplicação backend foi construída utilizando as seguintes tecnologias e bibliotecas:

- **Node.js** com **TypeScript**: Base e linguagem do projeto.
- **NestJS**: Framework principal da aplicação.
- **Prisma**: ORM para comunicação e modelagem do banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Vitest & Supertest**: Frameworks utilizados para criação e execução dos testes Unitários e E2E.
- **Zod**: Validação de esquemas e payload das requisições (Data Transfer Objects).
- **Passport & JWT**: Sistema de Autenticação e proteção das rotas privadas.
- **Bcryptjs**: Criptografia de senhas (Hashing).
- **Docker**: Infraestrutura conteinerizada para o banco de dados (configurado no `docker-compose.yml`).

---

## 🏗️ Arquitetura do Projeto

O projeto foi organizado de forma modular, seguindo os preceitos e boas práticas do **Domain-Driven Design (DDD)** aliado a uma **Clean Architecture (Arquitetura Limpa)**. A pasta `src` é dividida em três domínios principais:

### 1. `core`
Mantém as tipagens utilitárias globais, estruturas de tratamento de erro (como `either.ts` inspirado em programação funcional para separar cenários de Sucesso/Falha) e lógicas de Entidades base que são estendidas no domínio.

### 2. `domain`
O coração das regras de negócios, subdividido em:
- **`enterprise`**: Contém as Entidades ricas do negócio (Food, Category, Meal, MealItem, User, Waste). Não depende de nada externo.
- **`application`**: Armazena os Casos de Uso (Use Cases) e os Contratos/Interfaces (Repositories, Cryptography). Também não possui dependência de frameworks.

### 3. `infra`
É onde os detalhes técnicos residem e a conexão com o **NestJS** acontece.
- **`auth`**: Estratégias e guardas do JWT (`JwtAuthGuard`, `Public`, etc).
- **`cryptography`**: Implementações de hash utilizando `bcrypt` e JWT encrypter.
- **`database`**: Configuração e implementações do Prisma (PrismaRepositories) concretizando as interfaces definidas na camada de domínio.
- **`env`**: Tratamento e validação estrita de variáveis de ambiente do projeto utilizando Zod.
- **`http`**: A camada de comunicação da API. Contém os **Controllers**, **Presenters** (para formatar a devolução das respostas HTTP) e os **Pipes** (validação do Zod no NestJS).

---

## 🛣️ Rotas da API

Abaixo encontram-se as principais rotas identificadas na camada de infraestrutura (`infra/http/controllers`). 

> **Observação:** O projeto possui um script chamado `pluralize_routes.js` que demonstra uma transição para padronizar as rotas para o plural. Atualmente, os controllers possuem a seguinte estrutura:

### 🔐 Autenticação e Usuário
- `POST /account`: Criação de novo usuário (Registro). _[Público]_
- `POST /session`: Autenticação e geração do token JWT (Login). _[Público]_

### 📁 Categorias (Categories)
- `POST /categories`: Criar nova categoria.
- `GET /categories`: Listar categorias recentes.
- `GET /categories/:id`: Obter detalhes de uma categoria por ID.
- `PUT /category/:id`: Editar categoria existente.
- `DELETE /category/:categoryId`: Excluir categoria.

### 🍎 Alimentos (Foods)
- `POST /foods`: Cadastrar alimento vinculado a uma categoria.
- `GET /foods`: Buscar alimentos recentes.
- `GET /foods/:id`: Buscar detalhes do alimento.
- `PUT /food/:id`: Editar alimento.
- `DELETE /food/:foodId`: Deletar alimento.

### 🍽️ Refeições (Meals)
- `POST /meal`: Criar uma refeição (relacionando com o turno e o usuário).
- `GET /meals`: Listar refeições recentes.
- `GET /meal/:id`: Obter dados de uma refeição.
- `PUT /meal/:id`: Editar uma refeição.
- `DELETE /meal/:mealId`: Deletar refeição.

### 🍱 Itens da Refeição (Meal Items)
- `POST /mealItem`: Adicionar um item de alimento à uma refeição.
- `GET /mealItems`: Buscar itens recentes.
- `GET /mealItem/:id`: Buscar detalhes do item.
- `GET /meals/:mealId/items`: Buscar todos os itens de uma refeição específica.
- `PUT /mealItems/:id`: Editar quantidades servidas ou consumidas do item.
- `DELETE /mealItems/:mealItemId`: Deletar item da refeição.

### 🗑️ Desperdícios (Wastes)
- `POST /waste`: Registrar desperdício vinculando a um item de refeição (motivos: `LEFTOVER`, `ITSPOILED`, `ERROR_PREPARATION`).
- `GET /wastes`: Listar todos os desperdícios.
- `GET /wastes/:id`: Buscar detalhe de um desperdício.
- `PUT /wastes/:id`: Alterar registro de desperdício.
- `DELETE /wastes/:wasteId`: Excluir desperdício.

---

## 🛠️ Como rodar o ambiente

1. Crie ou configure as variáveis de ambiente utilizando como base o Zod schema (ex: `DATABASE_URL`, `PORT`, `JWT_PRIVATE_KEY` e `JWT_PUBLIC_KEY`).
2. Suba o banco de dados via docker com `docker-compose up -d`.
3. Rode as migrações do Prisma com `npx prisma migrate dev`.
4. Inicie o servidor com `npm run start:dev`.
