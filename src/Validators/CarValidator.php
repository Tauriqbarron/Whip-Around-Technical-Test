<?php

class CarValidator {
    public static function validate(?array $data): array {
        $errors = [];
        $currentYear = (int)date('Y');

        if (!isset($data['name']) || !is_string($data['name']) || trim($data['name']) === '' || strlen($data['name']) > 255) {
            $errors[] = 'Name is required and must be a non-empty string with a maximum length of 255 characters.';
        }

        if (!isset($data['make']) || !is_string($data['make']) || trim($data['make']) === '' || strlen($data['make']) > 255) {
            $errors[] = 'Make is required and must be a non-empty string with a maximum length of 255 characters.';
        }

        if (!isset($data['model']) || !is_string($data['model']) || trim($data['model']) === '' || strlen($data['model']) > 255) {
            $errors[] = 'Model is required and must be a non-empty string with a maximum length of 255 characters.';
        }

        if (!isset($data['year']) || !is_int($data['year']) || $data['year'] < 1886 || $data['year'] > ($currentYear + 1)) {
            $errors[] = "Year is required and must be an integer between 1886 and " . ($currentYear + 1) . ".";
        }

        return $errors;
    }
}