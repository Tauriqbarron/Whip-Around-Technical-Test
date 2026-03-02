<?php

/**
 * =================================================================
 * CAR VALIDATOR — src/Validators/CarValidator.php
 * =================================================================
 *
 * Class: CarValidator
 * Validates input data for POST /cars. All methods are static.
 *
 * =================================================================
 * FUNCTION: validate(array|null $data): array
 * =================================================================
 * Accepts the decoded JSON body (or null if body was empty/invalid).
 * Returns an array of error message strings. Empty array = valid.
 *
 * Validation rules:
 *   name  — required, must be a non-empty string, max 255 characters
 *   make  — required, must be a non-empty string, max 255 characters
 *   model — required, must be a non-empty string, max 255 characters
 *   year  — required, must be an integer, range 1886 to (current year + 1)
 *
 * Example return when invalid:
 *   ["Name is required and must be a string.", "Year must be between 1886 and 2027."]
 *
 * Example return when valid:
 *   []
 *
 * =================================================================
 */

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