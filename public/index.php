<?php

Require_once __DIR__ . '/../src/Models/Database.php';
Require_once __DIR__ . '/../src/Controllers/CarController.php';
Require_once __DIR__ . '/../src/Controllers/InspectionController.php';
Require_once __DIR__ . '/../src/Validators/CarValidator.php';
Require_once __DIR__ . '/../src/Validators/InspectionValidator.php';

/**
 * =================================================================
 * ENTRY POINT — public/index.php
 * =================================================================
 *
 * This file serves as the single entry point for all API requests.
 * It sets headers, handles CORS preflight, routes requests to controllers,
 * and manages error handling.
 *
 * =================================================================
 * FUNCTION: setHeaders()
 * =================================================================
 * Sets common response headers for JSON content and CORS.
 *
 * =================================================================
 * FUNCTION: handlePreflight()
 * =================================================================
 * Responds to OPTIONS requests for CORS preflight with 204 No Content.
 *
 * =================================================================
 * FUNCTION: route(PDO $pdo, string $method, string $uri)
 * =================================================================
 * Routes incoming requests based on HTTP method and URI path.
 *
 * Supported routes:
 *   GET /cars          -> CarController::getAll()
 *   POST /cars         -> CarController::create()
 *   GET /inspections   -> InspectionController::getAll()
 *   POST /inspections  -> InspectionController::create()
 *
 * Unmatched routes return a 404 Not Found error.
 *
 * =================================================================
 */


/**
 * =================================================================
 * FUNCTION: setHeaders()
 * =================================================================
 * Sets common response headers for JSON content and CORS.
 *
 * =================================================================
 */
function setHeaders(): void {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}


/**
 * =================================================================
 * FUNCTION: handlePreflight()
 * =================================================================
 * Responds to OPTIONS requests for CORS preflight with 204 No Content.
 *
 * =================================================================
 */
function handlePreflight(): void {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}


/**
 * =================================================================
 * FUNCTION: route(PDO $pdo, string $method, string $uri)
 * =================================================================
 * Routes incoming requests based on HTTP method and URI path.
 *
 * Supported routes:
 *   GET /cars          -> CarController::getAll()
 *   POST /cars         -> CarController::create()
 *   GET /inspections   -> InspectionController::getAll()
 *   POST /inspections  -> InspectionController::create()
 *
 * Unmatched routes return a 404 Not Found error.
 *
 * =================================================================
 */
function route(PDO $pdo, string $method, string $uri): void {

    
    match("$method $uri") {
        'GET /cars' => CarController::getAll($pdo),
        'POST /cars' => CarController::create($pdo),
        'GET /inspections' => InspectionController::getAll($pdo),
        'POST /inspections' => InspectionController::create($pdo),
        default => handleNoMatch(404, "Not found.")
    };
}

/**
 * =================================================================
 * FUNCTION: handleNoMatch(int $code, string $message)
 * =================================================================
 * Handles unmatched routes or methods by returning appropriate JSON errors.
 *
 * - If message starts with "Not found", return 404
 * - If message starts with "Method not allowed", return 405
 * - Otherwise, return 400 Bad Request
 *
 * =================================================================
 */
function handleNoMatch(int $code, string $message): void {
    if (str_starts_with($message, "Not found")) {
        jsonError(404, $message);
    } elseif (str_starts_with($message, "Method not allowed")) {
        jsonError(405, $message);
    } else {
        jsonError(400, $message);
    }
}

/**
 * =================================================================
 * FUNCTION: jsonError(int $code, string $message)
 * =================================================================
 * Utility function to send a JSON error response with a given HTTP status code.
 *
 * - Sets the HTTP response code
 * - Outputs a JSON object with an "error" key containing the message
 * - Exits the script to prevent further processing
 *
 * =================================================================
 */
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