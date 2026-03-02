# Whip Around Technical Assessment — Planning Guide

## Assessment Summary

Build 4 REST API endpoints in **PHP** for a fleet maintenance platform:

| Method | Endpoint          | Purpose                       |
|--------|-------------------|-------------------------------|
| GET    | `/cars`           | Retrieve all cars             |
| POST   | `/cars`           | Create a new car              |
| GET    | `/inspections`    | Retrieve all inspections      |
| POST   | `/inspections`    | Create an inspection for a car|

**Time limit:** 2 hours
**Deliverables:** Zipped solution with README.md

---

## Key Aspects of a Production-Grade API

### 1. Input Validation

Validate every piece of incoming data. Never trust client input.

**What to validate:**
- Required fields are present
- Data types are correct (string, int, bool)
- Values are within acceptable ranges
- String lengths are reasonable

**Example (unrelated — a bookstore API):**

```php
// BAD — no validation
$title = $data['title'];
$pages = $data['pages'];

// GOOD — validate everything
$errors = [];

if (empty($data['title']) || !is_string($data['title'])) {
    $errors[] = 'Title is required and must be a string.';
}

if (strlen($data['title']) > 255) {
    $errors[] = 'Title must not exceed 255 characters.';
}

if (!isset($data['pages']) || !is_int($data['pages']) || $data['pages'] < 1) {
    $errors[] = 'Pages must be a positive integer.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}
```

---

### 2. Proper HTTP Status Codes

Use the correct status code for each scenario. This is what separates a junior API from a professional one.

| Code | Meaning               | When to use                              |
|------|-----------------------|------------------------------------------|
| 200  | OK                    | Successful GET request                   |
| 201  | Created               | Successful POST that creates a resource  |
| 400  | Bad Request           | Malformed JSON or missing Content-Type   |
| 404  | Not Found             | Resource doesn't exist                   |
| 405  | Method Not Allowed    | Wrong HTTP method on an endpoint         |
| 422  | Unprocessable Entity  | Valid JSON but fails validation rules     |
| 500  | Internal Server Error | Unexpected server failure                |

**Example (unrelated — a pet store API):**

```php
// GET /pets — return 200 with data
http_response_code(200);
echo json_encode($pets);

// POST /pets — return 201 with the created resource
http_response_code(201);
echo json_encode(['id' => $newId, 'name' => $name, 'species' => $species]);

// POST /pets with invalid data — return 422
http_response_code(422);
echo json_encode(['errors' => ['Species must be one of: dog, cat, bird']]);

// GET /pets/999 where 999 doesn't exist — return 404
http_response_code(404);
echo json_encode(['error' => 'Pet not found.']);
```

---

### 3. Consistent JSON Response Structure

Every response should follow a predictable structure so the client always knows what to expect.

**Example (unrelated — a movie API):**

```php
// Success response for a list
{
    "data": [
        {"id": 1, "title": "Inception", "director": "Christopher Nolan"}
    ]
}

// Success response for a single created resource
{
    "data": {"id": 5, "title": "Interstellar", "director": "Christopher Nolan"}
}

// Error response
{
    "error": "Validation failed.",
    "details": [
        "Title is required.",
        "Director must be a string."
    ]
}
```

---

### 4. Error Handling

Catch exceptions and unexpected failures gracefully. Never expose stack traces or internal details to the client.

**Example (unrelated — a recipe API):**

```php
// BAD — raw exception leaks to client
$recipe = $db->query("SELECT * FROM recipes WHERE id = $id");

// GOOD — wrapped with error handling
try {
    $stmt = $pdo->prepare("SELECT * FROM recipes WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $recipe = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$recipe) {
        http_response_code(404);
        echo json_encode(['error' => 'Recipe not found.']);
        exit;
    }

    http_response_code(200);
    echo json_encode(['data' => $recipe]);
} catch (PDOException $e) {
    error_log($e->getMessage()); // log internally
    http_response_code(500);
    echo json_encode(['error' => 'An internal error occurred.']);
}
```

---

### 5. SQL Injection Prevention (Prepared Statements)

**Never** concatenate user input into SQL. Always use prepared statements.

**Example (unrelated — a student API):**

```php
// BAD — SQL injection vulnerability
$name = $_POST['name'];
$db->query("INSERT INTO students (name) VALUES ('$name')");

// GOOD — parameterized query
$stmt = $pdo->prepare("INSERT INTO students (name, grade) VALUES (:name, :grade)");
$stmt->execute([
    ':name'  => $data['name'],
    ':grade' => $data['grade'],
]);
```

---

### 6. CORS Headers

If a frontend will call your API, you need to handle CORS (Cross-Origin Resource Sharing).

**Example:**

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
```

---

### 7. Clean Project Structure

Organize code so it's maintainable and easy to navigate.

**Example structure (unrelated — generic PHP API):**

```
project/
├── public/
│   └── index.php          # Entry point / router
├── src/
│   ├── Controllers/       # Request handling logic
│   ├── Models/             # Database interaction
│   └── Validators/         # Input validation
├── database/
│   └── schema.sql          # Database schema
├── .env                    # Environment config (not committed)
├── composer.json
└── README.md
```

---

### 8. Routing & Method Handling

A simple router that dispatches based on URI and HTTP method.

**Example (unrelated — a task API):**

```php
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Simple router
match (true) {
    $method === 'GET'  && $uri === '/tasks'  => getAll Tasks(),
    $method === 'POST' && $uri === '/tasks'  => createTask(),
    default => methodNotAllowed(),
};

function methodNotAllowed(): void {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
}
```

---

### 9. Foreign Key Integrity

When one resource references another (e.g., an inspection references a car), validate the reference exists before inserting.

**Example (unrelated — an order API referencing customers):**

```php
// Before creating an order, verify the customer exists
$stmt = $pdo->prepare("SELECT id FROM customers WHERE id = :id");
$stmt->execute([':id' => $data['customer_id']]);

if (!$stmt->fetch()) {
    http_response_code(422);
    echo json_encode(['error' => 'Customer not found. Cannot create order.']);
    exit;
}

// Now safe to insert the order
$stmt = $pdo->prepare("INSERT INTO orders (customer_id, total) VALUES (:cid, :total)");
$stmt->execute([':cid' => $data['customer_id'], ':total' => $data['total']]);
```

---

### 10. Auto-Generated Timestamps

Let the server set timestamps, not the client. This ensures consistency and prevents tampering.

**Example (unrelated — a comment API):**

```sql
-- In the schema
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```php
// In PHP — don't accept created_at from the client
$stmt = $pdo->prepare("INSERT INTO comments (post_id, body) VALUES (:pid, :body)");
$stmt->execute([':pid' => $data['post_id'], ':body' => $data['body']]);
// created_at is auto-set by the database
```

---

## Recommended Tech Stack

### Backend: PHP (vanilla, no framework)

- **Why:** The assessment says "no over-engineering." A lean, framework-free PHP API demonstrates raw skill.
- **Database:** SQLite — zero config, single file, perfect for a take-home. No MySQL/Postgres setup needed for the reviewer.
- **PHP built-in server:** `php -S localhost:8000 -t public` — no Apache/Nginx needed.

### Frontend: React + Vite (with Tailwind CSS)

- **Why React + Vite:**
  - Fastest scaffolding: `npm create vite@latest frontend -- --template react`
  - Hot reload out of the box
  - Most reviewers are familiar with React
  - Vite builds in seconds

- **Why Tailwind:**
  - No custom CSS files needed — style directly in JSX
  - Looks polished with minimal effort
  - Utility classes are fast to write

- **UI Plan:**
  - **Cars tab** — Table listing all cars + a form to add a new car
  - **Inspections tab** — Table of inspections (with car name) + a form to create an inspection (dropdown to pick a car, checkboxes for wipers/engine/headlights)
  - Simple two-tab layout, clean card-based design

**Alternative (even faster):** If React feels like too much overhead, a single `index.html` with vanilla JS + Tailwind CDN would also work and keeps the project simpler.

---

## Project Plan / Task Breakdown

### Phase 1: Backend (PHP + SQLite)

1. Set up project structure (`public/index.php`, `src/`, `database/`)
2. Create SQLite schema (`cars` and `inspections` tables)
3. Build a simple router (match URI + method)
4. Implement `GET /cars` — fetch all cars
5. Implement `POST /cars` — validate input, insert, return 201
6. Implement `GET /inspections` — fetch all inspections
7. Implement `POST /inspections` — validate input, verify car exists, insert with auto timestamp, return 201
8. Add CORS headers
9. Add global error handling (try/catch at top level)

### Phase 2: Frontend

1. Scaffold React + Vite + Tailwind
2. Build Cars page (list + create form)
3. Build Inspections page (list + create form with car dropdown)
4. Wire up API calls with `fetch()`

### Phase 3: Polish

1. Write README.md (thought process, design choices, assumptions, run instructions)
2. Test all endpoints manually
3. Zip and submit

---

## Assumptions to Document in README

- SQLite is used for simplicity (no external DB setup required)
- No authentication (not in scope)
- `performedAt` is server-generated, not client-supplied
- IDs are auto-incremented integers
- All inspection fields (wipers, engineSound, headlights) are required booleans
- Year must be a reasonable value (e.g., 1886–current year + 1)
- The API is designed for a single-user local environment (no concurrency concerns)
