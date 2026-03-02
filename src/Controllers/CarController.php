<?php

class CarController {
    public static function getAll(PDO $pdo): void {
        $stmt = $pdo->query('SELECT * FROM cars ORDER BY id DESC');
        $cars = [];
        while ($row = $stmt->fetch()) {
            $cars[] = self::formatRow($row);
        }
        http_response_code(200);
        echo json_encode($cars);
    }

    public static function create(PDO $pdo): void {
        $body = file_get_contents('php://input');
        $data = json_decode($body, true);

        if($data === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON.']);
            return;
        }

        $errors = CarValidator::validate($data);
        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['error' => 'Validation failed.', 'details' => $errors]);
            return;
        }

        $stmt = $pdo->prepare('INSERT INTO cars (name, make, model, year) VALUES (:name, :make, :model, :year)');
        $stmt->execute([
            ':name' => $data['name'],
            ':make' => $data['make'],
            ':model' => $data['model'],
            ':year' => $data['year']
        ]);

        $newId = (int)$pdo->lastInsertId();
        http_response_code(201);
        echo json_encode([
            'id' => $newId,
            'name' => $data['name'],
            'make' => $data['make'],
            'model' => $data['model'],
            'year' => (int)$data['year']
        ]);
    }

    private static function formatRow(array $row): array {
        return [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'make' => $row['make'],
            'model' => $row['model'],
            'year' => (int)$row['year']
        ];
    }
}
