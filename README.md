# Fleet Maintenance API

A REST API and React frontend for managing a fleet of cars and their inspections.

## Tech Stack

- **Backend:** PHP 8.3 (vanilla, no framework)
- **Database:** SQLite via PDO
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Testing:** PHPUnit (integration tests)

## Getting Started

### Prerequisites

- PHP 8.1+ with SQLite extension
- Composer
- Node.js 18+

### Installation

```bash
# Install PHP dependencies
composer install

# Install frontend dependencies
cd frontend && npm install
```

### Running the Application

Start both servers:

```bash
# Backend (from project root)
php -S localhost:8000 -t public

# Frontend (from frontend/)
cd frontend && npm run dev
```

- Backend API: http://localhost:8000
- Frontend: http://localhost:5173

The database is created automatically on first request — no manual setup needed.

### Running Tests

```bash
# Start the backend server first, then:
./vendor/bin/phpunit
```

23 integration tests covering all endpoints, validation rules, error handling, and routing.

## API Endpoints

| Method | Endpoint       | Status | Description                 |
|--------|----------------|--------|-----------------------------|
| GET    | /cars          | 200    | Retrieve all cars           |
| POST   | /cars          | 201    | Create a new car            |
| GET    | /inspections   | 200    | Retrieve all inspections    |
| POST   | /inspections   | 201    | Create a new inspection     |

### POST /cars

```json
{
  "name": "Van 1",
  "make": "Toyota",
  "model": "HiAce",
  "year": 2022
}
```

### POST /inspections

```json
{
  "carId": 1,
  "wipers": true,
  "engineSound": true,
  "headlights": false
}
```

### Error Responses

Validation errors return 422 with details:

```json
{
  "error": "Validation failed.",
  "details": [
    "Name is required and must be a non-empty string with a maximum length of 255 characters.",
    "Year is required and must be an integer between 1886 and 2027."
  ]
}
```

Invalid JSON returns 400. Unknown endpoints return 404. Wrong HTTP method returns 405.

## Project Structure

```
project/
├── public/
│   └── index.php              # Entry point and router
├── src/
│   ├── Controllers/
│   │   ├── CarController.php
│   │   └── InspectionController.php
│   ├── Models/
│   │   └── Database.php       # SQLite connection and schema init
│   └── Validators/
│       ├── CarValidator.php
│       └── InspectionValidator.php
├── database/
│   └── schema.sql             # Reference schema
├── frontend/
│   └── src/
│       ├── App.tsx            # Main layout with tabs
│       ├── api/api.ts         # API service functions
│       ├── types/index.ts     # TypeScript interfaces
│       └── components/
│           ├── CarList.tsx
│           ├── CarForm.tsx
│           ├── InspectionList.tsx
│           └── InspectionForm.tsx
├── tests/
│   └── ApiTest.php            # PHPUnit integration tests
└── README.md
```

## Design Decisions

- **No framework:** The assessment calls for demonstrating core PHP skills without over-engineering. A simple `match` expression handles routing cleanly for 4 endpoints.
- **SQLite:** Zero configuration — no external database server needed. The database file is created automatically and the schema is initialized on first connection via `CREATE TABLE IF NOT EXISTS`.
- **Prepared statements:** All queries use PDO named parameters to prevent SQL injection.
- **Foreign key integrity:** Before creating an inspection, the API verifies the referenced car exists. SQLite foreign keys are explicitly enabled via `PRAGMA foreign_keys = ON`.
- **Server-generated timestamps:** `performed_at` and `created_at` are set by the database via `DEFAULT CURRENT_TIMESTAMP`, not accepted from the client.
- **snake_case to camelCase mapping:** The database uses snake_case (`car_id`, `engine_sound`) while the API uses camelCase (`carId`, `engineSound`). Controllers handle the mapping in `formatRow()` methods.
- **Boolean casting:** SQLite stores booleans as 0/1 integers. The API casts these to proper PHP/JSON booleans in responses.
- **Optimistic UI updates:** After creating a car or inspection, the frontend prepends the server response to the local state array instead of re-fetching the full list.

## Assumptions

- SQLite is used for simplicity (no external database setup required for the reviewer)
- No authentication (not in scope for this assessment)
- `performedAt` is server-generated, not client-supplied
- IDs are auto-incremented integers
- All inspection fields (`wipers`, `engineSound`, `headlights`) are required booleans
- Year must be between 1886 and current year + 1
- The API is designed for a single-user local environment (no concurrency concerns)
