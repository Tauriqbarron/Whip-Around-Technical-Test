<?php

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
