<?php

Require_once __DIR__ . '/../src/Models/Database.php';
Require_once __DIR__ . '/../src/Controllers/CarController.php';
Require_once __DIR__ . '/../src/Controllers/InspectionController.php';
Require_once __DIR__ . '/../src/Validators/CarValidator.php';
Require_once __DIR__ . '/../src/Validators/InspectionValidator.php';

function setHeaders(): void {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function handlePreflight(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function route(PDO $pdo, string $method, string $uri): void {
    $availableUris = ['/cars', '/inspections'];
    
    match("$method $uri") {
        'GET /cars' => CarController::getAll($pdo),
        'POST /cars' => CarController::create($pdo),
        'GET /inspections' => InspectionController::getAll($pdo),
        'POST /inspections' => InspectionController::create($pdo),
        default => in_array($uri, $availableUris) 
            ? jsonError(405, "Method $method not allowed for $uri.") 
            : jsonError(404, "Endpoint $uri not found.")
    };
}

function jsonError(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}


setHeaders();
handlePreflight();

try {
    $db = new Database();
    $pdo = $db->getConnection();

    $method = $_SERVER['REQUEST_METHOD'];
    $uri = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

    route($pdo, $method, $uri);
} catch (Throwable $e) {
    error_log("Internal Server Error: " . $e->getMessage());
    jsonError(500, "An internal server error occurred.");
}