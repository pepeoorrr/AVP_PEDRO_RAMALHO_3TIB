# AGENT GUIDE

## Project overview
This repository is a didactic authentication template for a web development class. It contains:
- a Node.js + Express API
- Prisma ORM with MySQL
- user registration and login flow
- JWT-based authentication
- protected routes via middleware
- a React frontend in the frontend folder

## Tech stack
- Node.js 18+
- Express (ES modules)
- Prisma
- MySQL
- bcrypt
- jsonwebtoken
- dotenv
- CORS
- Vite + React for the frontend

## Repository structure
- src/app.js: Express app setup
- src/server.js: server bootstrap
- src/controllers/: request handlers for auth and user logic
- src/middlewares/authMiddleware.js: token verification
- src/routes/: route declarations
- src/prismaClient.js: Prisma client setup
- prisma/schema.prisma: database schema
- prisma/seed.js: seed data for demo user
- frontend/: React app

## How to run the project
1. Install dependencies:
   npm install
2. Configure environment variables from .env.example to .env
3. Ensure MySQL is running
4. Run Prisma migration:
   npx prisma migrate dev --name init
5. Seed the database:
   npx prisma db seed
6. Start the backend:
   npm run dev

## Important environment variables
Use a .env file with values similar to:
- DATABASE_URL="mysql://usuario:senha@localhost:3306/template_auth_tcc"
- JWT_SECRET="troque_essa_chave"
- JWT_EXPIRES_IN="1d"
- PORT=3000

## Authentication flow
The app follows this sequence:
1. User registers
2. Password is hashed with bcrypt
3. User logs in
4. Server validates credentials and returns JWT
5. Client sends the token in Authorization: Bearer <token>
6. authMiddleware validates the JWT
7. Protected route executes only when validation passes

## Coding conventions
- Keep code compatible with ES modules (`import`/`export`)
- Use Prisma client through src/prismaClient.js
- Prefer small controller functions for clear responsibilities
- Keep routes thin and delegate logic to controllers
- Validate auth errors consistently and return readable JSON responses
- Preserve the educational style of the project

## Frontend notes
- The frontend is in the frontend folder and uses Vite
- It interacts with the backend API to handle login, registration, and profile access
- Protected routes should require a valid token before rendering protected content

## Verification commands
Use these commands when validating changes:
- npm run dev
- npx prisma validate
- npx prisma migrate dev
- npx prisma db seed

## Typical task guidance
When modifying this codebase:
- update the Prisma schema and migration together when changing database models
- keep auth flows consistent between controllers, middleware, and routes
- avoid storing raw passwords anywhere
- ensure JWT verification happens before protected data access
- prefer minimal, surgical changes that match the current project structure
