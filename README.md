# Koktajlownik

**Your cocktail recipe companion**

## Tech Stack

<div align="center">

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/) [![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org/) [![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma)](https://www.prisma.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql)](https://www.postgresql.org/)

[![Jest](https://img.shields.io/badge/Jest-30.x-C21325?logo=jest)](https://jestjs.io/) [![Swagger](https://img.shields.io/badge/Swagger-11.x-85EA2D?logo=swagger)](https://swagger.io/) [![Status](https://img.shields.io/badge/Status-Beta-orange)]() [![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

## About the Project

**Koktajlownik** is a RESTful API for managing cocktail recipes and ingredients. Built with NestJS and Prisma, it provides a robust backend for cocktail enthusiasts to discover, create, and manage their favorite drink recipes.

### Key Features

- **Cocktail Management** - Create, read, update, and delete cocktail recipes
- **Ingredient Database** - Comprehensive ingredient library with types and descriptions
- **Smart Filtering** - Filter cocktails by category, name, or ingredients
- **Relationship Tracking** - Link cocktails with ingredients and quantities
- **Type Safety** - Full TypeScript support with Prisma ORM
- **API Documentation** - Interactive Swagger/OpenAPI documentation

## Database Schema

```mermaid
erDiagram
    Cocktail ||--o{ CocktailIngredient : "contains"
    Ingredient ||--o{ CocktailIngredient : "used in"

    Cocktail {
        int id PK "Primary Key"
        string name "Cocktail Name"
        string category "Category"
        string instruction "Instructions"
        datetime createdAt "Created"
        datetime updatedAt "Updated"
    }

    Ingredient {
        int id PK "Primary Key"
        string name UK "Unique Name"
        string description "Description"
        string type "Type"
        string photo "Photo URL"
        datetime createdAt "Created"
        datetime updatedAt "Updated"
    }

    CocktailIngredient {
        int cocktailId FK "Cocktail Reference"
        int ingredientId FK "Ingredient Reference"
        string quantity "Quantity"
    }
```

## API Endpoints

### Cocktails

- `GET /api/cocktail` - List all cocktails with optional filters
- `GET /api/cocktail/:id` - Get cocktail by ID
- `POST /api/cocktail` - Create new cocktail
- `PATCH /api/cocktail/:id` - Update cocktail
- `DELETE /api/cocktail/:id` - Delete cocktail

### Ingredients

- `GET /api/ingredient` - List all ingredients with optional filters
- `GET /api/ingredient/:id` - Get ingredient by ID
- `POST /api/ingredient` - Create new ingredient
- `PATCH /api/ingredient/:id` - Update ingredient
- `DELETE /api/ingredient/:id` - Delete ingredient

### Database

- `GET /api/database/stats` - Get database statistics

## Getting Started

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
DATABASE_URL="postgresql://user:password@localhost:5432/koktajlownik"
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/koktajlownik_test"
```

3. Run database migrations:

```bash
npx prisma migrate dev
```

4. Seed the database (optional):

```bash
npx prisma db seed
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:5000`

Swagger documentation: `http://localhost:5000/api`

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# E2E tests in watch mode
npm run test:e2e:watch

# Test coverage
npm run test:cov
```

## Scripts

- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
