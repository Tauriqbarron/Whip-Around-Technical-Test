<?php

/**
 * =================================================================
 * INSPECTION VALIDATOR — src/Validators/InspectionValidator.php
 * =================================================================
 *
 * Class: InspectionValidator
 * Validates input data for POST /inspections. All methods are static.
 *
 * =================================================================
 * FUNCTION: validate(array|null $data): array
 * =================================================================
 * Accepts the decoded JSON body (or null if body was empty/invalid).
 * Returns an array of error message strings. Empty array = valid.
 *
 * Validation rules:
 *   carId       — required, must be an integer
 *   wipers      — required, must be a boolean
 *   engineSound — required, must be a boolean
 *   headlights  — required, must be a boolean
 *
 * NOTE: The request body uses camelCase keys (carId, engineSound)
 * matching the assessment spec. The controller handles mapping
 * to snake_case (car_id, engine_sound) when inserting into the DB.
 *
 * Example return when invalid:
 *   ["carId is required and must be an integer.", "wipers must be a boolean."]
 *
 * Example return when valid:
 *   []
 *
 * =================================================================
 */

class InspectionValidator {
    public static function validate(?array $data): array {
        $errors = [];

        if (!isset($data['carId']) || !is_int($data['carId'])) {
            $errors[] = 'carId is required and must be an integer.';
        }

        if (!isset($data['wipers']) || !is_bool($data['wipers'])) {
            $errors[] = 'wipers is required and must be a boolean.';
        }

        if (!isset($data['engineSound']) || !is_bool($data['engineSound'])) {
            $errors[] = 'engineSound is required and must be a boolean.';
        }

        if (!isset($data['headlights']) || !is_bool($data['headlights'])) {
            $errors[] = 'headlights is required and must be a boolean.';
        }

        return $errors;
    }
}   
