<?php

/**
 * =================================================================
 * INSPECTION CONTROLLER — src/Controllers/InspectionController.php
 * =================================================================
 *
 * Class: InspectionController
 * Handles business logic for inspection-related API endpoints.
 */
class InspectionController {
    public static function getAll(PDO $pdo): void {
        $stmt = $pdo->query('SELECT * FROM inspections ORDER BY id DESC');
        $inspections = [];
        while ($row = $stmt->fetch()) {
            $inspections[] = self::formatRow($row);
        }
        http_response_code(200);
        echo json_encode($inspections);
    }

    public static function create(PDO $pdo): void {
        $body = file_get_contents('php://input');
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON.']);
            return;
        }

        $errors = InspectionValidator::validate($data);
        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['error' => 'Validation failed.', 'details' => $errors]);
            return;
        }

        // Verify car exists
        $stmt = $pdo->prepare('SELECT id FROM cars WHERE id = :id');
        $stmt->execute([':id' => $data['carId']]);
        if ($stmt->fetch() === false) {
            http_response_code(422);
            echo json_encode(['error' => 'Car not found. Cannot create inspection.']);
            return;
        }

        // Insert new inspection
        $stmt = $pdo->prepare('INSERT INTO inspections (car_id, wipers, engine_sound, headlights) VALUES (:car_id, :wipers, :engine_sound, :headlights)');
        $stmt->execute([
            ':car_id' => $data['carId'],
            ':wipers' => (int)$data['wipers'], // Cast bool to int for DB
            ':engine_sound' => (int)$data['engineSound'],
            ':headlights' => (int)$data['headlights']
        ]);

        $newId = (int)$pdo->lastInsertId();

        // Fetch the created row to get performed_at
        $stmt = $pdo->prepare('SELECT * FROM inspections WHERE id = :id');
        $stmt->execute([':id' => $newId]);
        $createdRow = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode(self::formatRow($createdRow));
    }

    private static function formatRow(array $row): array {
        return [
            'id' => (int)$row['id'],
            'carId' => (int)$row['car_id'],
            'wipers' => (bool)$row['wipers'],
            'engineSound' => (bool)$row['engine_sound'],
            'headlights' => (bool)$row['headlights'],
            'performedAt' => $row['performed_at']
        ];
    }
}   

