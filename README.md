# Miew Starter

A modern TypeScript backend project built with Fastify and Prisma ORM.

[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.2-blue)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-v4.22-orange)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-v5.2-blueviolet)](https://www.prisma.io/)

## 🚀 Features

- **Fastify** - Fast and low overhead web framework for Node.js
- **Prisma ORM** - Next-generation ORM with type-safety and auto-generated migrations
- **TypeScript** - Static typing and modern JavaScript features
- **PostgreSQL** - Robust, open-source relational database
- **Swagger UI** - Interactive API documentation
- **Docker** - Containerized development environment
- **Jest** - Testing framework with code coverage reports
- **ESLint & Prettier** - Code quality and formatting tools

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (or Docker for containerized setup)
- Git

## 🚦 Getting Started

### Install Dependencies

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database connection details and other settings
```

### Database Setup

```bash
# Start the PostgreSQL database with Docker
docker-compose up -d

# Generate Prisma client
npm run generate

# Apply database migrations
npm run migrate:dev

# (Optional) Explore your database with Prisma Studio
npm run db:studio
```

### Run the Application

```bash
# Development mode with hot reloading
npm run dev

# Or build and run in production mode
npm run build
npm run start
```

### API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:3000/documentation
```

## 📁 Project Structure

```
miew-starter/
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma data model definition
│   └── migrations/         # Database migrations
├── src/
│   ├── plugins/            # Fastify plugins
│   ├── routes/             # API route definitions
│   │   ├── user.routes.ts  # User-related endpoints
│   │   └── post.routes.ts  # Post-related endpoints
│   ├── services/           # Business logic
│   │   ├── user.service.ts # User service implementation
│   │   └── post.service.ts # Post service implementation
│   ├── app.ts              # Application setup and plugin registration
│   └── server.ts           # Server entry point
├── test/                   # Test files
│   ├── user.routes.test.ts # API route tests
│   └── user.service.test.ts# Service layer tests
├── .env                    # Environment variables (not in repo)
├── .env.example            # Example environment variables
├── docker-compose.yml      # Docker configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies and scripts
```

## 📘 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript code to JavaScript |
| `npm run start` | Start the production server |
| `npm run dev` | Start the development server with hot reload |
| `npm run test` | Run test suite with Jest |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code using Prettier |
| `npm run migrate:dev` | Run Prisma migrations in development |
| `npm run migrate:deploy` | Run Prisma migrations in production |
| `npm run db:studio` | Open Prisma Studio to explore the database |
| `npm run generate` | Generate Prisma client code |

## 🐳 Docker

The project includes Docker configuration for running a PostgreSQL database:

```bash
# Start the database
docker-compose up -d

# Stop the database
docker-compose down

# Stop and remove volumes
docker-compose down -v
```