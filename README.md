# Flower Business - Weekly Tracking Application

A fullstack application for tracking weekly flower business data built with Angular, NestJS, MongoDB, and Mongoose.

## Project Structure

```
flower-business/
├── apps/
│   ├── flower-api/          # NestJS backend API
│   └── flower-client/       # Angular frontend
├── packages/
│   └── shared-types/        # Shared DTOs and types
├── db/                      # MongoDB Docker configuration
└── package.json             # Root package.json with scripts
```

## Features

- Track weekly flower business metrics:
  - Quantity (menge) of flowers
  - Price per flower
  - Profit
  - Savings
  - Next week budget
- View all weeks in a beautiful card grid
- Add, edit, and delete weeks
- Summary statistics

## Prerequisites

- Node.js 18+
- Docker Desktop (for MongoDB)
- npm

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Start MongoDB:
```bash
npm run db:dev:up
```

3. Seed initial data (optional):
```bash
cd apps/flower-api
npm run seed
```

4. Start development servers:
```bash
npm run dev:full
```

This will start:
- API server on http://localhost:3000
- Angular app on http://localhost:4200
- MongoDB on port 28018

## Available Scripts

### Root Level
- `npm run dev:api` - Start API server only
- `npm run dev:client` - Start Angular app only
- `npm run dev:both` - Start both API and client
- `npm run dev:full` - Start database + API + client
- `npm run db:dev:up` - Start MongoDB
- `npm run db:dev:down` - Stop MongoDB
- `npm run db:dev:logs` - View MongoDB logs
- `npm run db:dev:shell` - Access MongoDB shell
- `npm run db:dev:reset` - Reset database (removes all data)

### API Scripts
- `cd apps/flower-api && npm run start:dev` - Start API in watch mode
- `cd apps/flower-api && npm run seed` - Seed initial week data

### Client Scripts
- `cd apps/flower-client && npm start` - Start Angular dev server

## API Endpoints

- `GET /flower-weeks` - Get all weeks
- `GET /flower-weeks/:id` - Get week by ID
- `GET /flower-weeks/summary` - Get summary statistics
- `POST /flower-weeks` - Create new week
- `PATCH /flower-weeks/:id` - Update week
- `DELETE /flower-weeks/:id` - Delete week

API documentation available at: http://localhost:3000/api

## Shared Types

The `packages/shared-types` package contains DTOs that are shared between the API and client:
- `FlowerWeekDTO`
- `CreateFlowerWeekDTO`
- `UpdateFlowerWeekDTO`
- `FlowerWeekSummaryDTO`

## Environment Variables

Create `.env` file in `apps/flower-api/`:
```
MONGODB_URL=mongodb://localhost:27018/flower-business
PORT=3000
```

## Current Week Data

The seed script creates the current week with:
- Quantity: 280
- Price: 220
- Profit: 318
- Savings: 200
- Next Week Budget: 300

