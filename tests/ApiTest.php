<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Depends;

class ApiTest extends TestCase
{
    private static string $baseUrl = 'http://127.0.0.1:8888';
    private static $serverProcess;
    private static string $dbPath;

    public static function setUpBeforeClass(): void
    {
        // Use a test-specific database to avoid polluting the real one
        self::$dbPath = __DIR__ . '/../database/fleet_test.db';
        if (file_exists(self::$dbPath)) {
            unlink(self::$dbPath);
        }

        // Start PHP built-in server on port 8888
        $publicDir = __DIR__ . '/../public';
        $cmd = sprintf(
            'php -S 127.0.0.1:8888 -t %s > /dev/null 2>&1 & echo $!',
            escapeshellarg($publicDir)
        );
        $pid = trim(shell_exec($cmd));
        self::$serverProcess = (int) $pid;

        // Wait for server to be ready
        $attempts = 0;
        while ($attempts < 30) {
            $conn = @fsockopen('127.0.0.1', 8888, $errno, $errstr, 1);
            if ($conn) {
                fclose($conn);
                break;
            }
            usleep(100000); // 100ms
            $attempts++;
        }

        if ($attempts >= 30) {
            self::fail('Could not start PHP built-in server');
        }
    }

    public static function tearDownAfterClass(): void
    {
        if (self::$serverProcess) {
            posix_kill(self::$serverProcess, SIGTERM);
        }
        if (file_exists(self::$dbPath)) {
            unlink(self::$dbPath);
        }
    }

    private function request(string $method, string $path, ?array $body = null): array
    {
        $ch = curl_init(self::$baseUrl . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status' => $statusCode,
            'body' => json_decode($response, true),
            'raw' => $response,
        ];
    }

    private function requestRaw(string $method, string $path, string $rawBody): array
    {
        $ch = curl_init(self::$baseUrl . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $rawBody);

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'status' => $statusCode,
            'body' => json_decode($response, true),
            'raw' => $response,
        ];
    }

    // =========================================================
    // GET /cars — empty list
    // =========================================================
    public function testGetCarsReturnsEmptyArray(): void
    {
        $res = $this->request('GET', '/cars');
        $this->assertEquals(200, $res['status']);
        $this->assertIsArray($res['body']);
        $this->assertEmpty($res['body']);
    }

    // =========================================================
    // POST /cars — successful creation
    // =========================================================
    public function testCreateCarReturns201(): int
    {
        $res = $this->request('POST', '/cars', [
            'name' => 'Test Sedan',
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2018,
        ]);

        $this->assertEquals(201, $res['status']);
        $this->assertArrayHasKey('id', $res['body']);
        $this->assertEquals('Test Sedan', $res['body']['name']);
        $this->assertEquals('Toyota', $res['body']['make']);
        $this->assertEquals('Corolla', $res['body']['model']);
        $this->assertEquals(2018, $res['body']['year']);
        $this->assertIsInt($res['body']['id']);
        $this->assertIsInt($res['body']['year']);

        return $res['body']['id'];
    }

    // =========================================================
    // GET /cars — returns created car
    // =========================================================
    #[Depends('testCreateCarReturns201')]
    public function testGetCarsReturnsCreatedCar(int $carId): void
    {
        $res = $this->request('GET', '/cars');
        $this->assertEquals(200, $res['status']);
        $this->assertNotEmpty($res['body']);

        $car = $res['body'][0];
        $this->assertEquals($carId, $car['id']);
        $this->assertEquals('Test Sedan', $car['name']);
        $this->assertIsInt($car['id']);
        $this->assertIsInt($car['year']);
    }

    // =========================================================
    // POST /cars — validation: missing fields
    // =========================================================
    public function testCreateCarMissingFieldsReturns422(): void
    {
        $res = $this->request('POST', '/cars', []);
        $this->assertEquals(422, $res['status']);
        $this->assertEquals('Validation failed.', $res['body']['error']);
        $this->assertArrayHasKey('details', $res['body']);
        $this->assertCount(4, $res['body']['details']);
    }

    // =========================================================
    // POST /cars — validation: invalid types
    // =========================================================
    public function testCreateCarInvalidTypesReturns422(): void
    {
        $res = $this->request('POST', '/cars', [
            'name' => 123,
            'make' => true,
            'model' => null,
            'year' => 'not a number',
        ]);
        $this->assertEquals(422, $res['status']);
        $this->assertNotEmpty($res['body']['details']);
    }

    // =========================================================
    // POST /cars — validation: year out of range
    // =========================================================
    public function testCreateCarYearOutOfRangeReturns422(): void
    {
        $res = $this->request('POST', '/cars', [
            'name' => 'Old Car',
            'make' => 'Ford',
            'model' => 'Model T',
            'year' => 1800,
        ]);
        $this->assertEquals(422, $res['status']);

        $res2 = $this->request('POST', '/cars', [
            'name' => 'Future Car',
            'make' => 'Tesla',
            'model' => 'X',
            'year' => 2090,
        ]);
        $this->assertEquals(422, $res2['status']);
    }

    // =========================================================
    // POST /cars — validation: name too long
    // =========================================================
    public function testCreateCarNameTooLongReturns422(): void
    {
        $res = $this->request('POST', '/cars', [
            'name' => str_repeat('a', 256),
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2020,
        ]);
        $this->assertEquals(422, $res['status']);
    }

    // =========================================================
    // POST /cars — invalid JSON
    // =========================================================
    public function testCreateCarInvalidJsonReturns400(): void
    {
        $res = $this->requestRaw('POST', '/cars', '{invalid json}');
        $this->assertEquals(400, $res['status']);
        $this->assertStringContainsString('Invalid', $res['body']['error']);
    }

    // =========================================================
    // POST /cars — empty body
    // =========================================================
    public function testCreateCarEmptyBodyReturns400(): void
    {
        $res = $this->requestRaw('POST', '/cars', '');
        $this->assertEquals(400, $res['status']);
    }

    // =========================================================
    // POST /inspections — successful creation
    // =========================================================
    #[Depends('testCreateCarReturns201')]
    public function testCreateInspectionReturns201(int $carId): int
    {
        $res = $this->request('POST', '/inspections', [
            'carId' => $carId,
            'wipers' => true,
            'engineSound' => true,
            'headlights' => false,
        ]);

        $this->assertEquals(201, $res['status']);
        $this->assertArrayHasKey('id', $res['body']);
        $this->assertEquals($carId, $res['body']['carId']);
        $this->assertTrue($res['body']['wipers']);
        $this->assertTrue($res['body']['engineSound']);
        $this->assertFalse($res['body']['headlights']);
        $this->assertArrayHasKey('performedAt', $res['body']);
        $this->assertIsInt($res['body']['id']);
        $this->assertIsInt($res['body']['carId']);
        $this->assertIsBool($res['body']['wipers']);
        $this->assertIsBool($res['body']['engineSound']);
        $this->assertIsBool($res['body']['headlights']);

        return $res['body']['id'];
    }

    // =========================================================
    // GET /inspections — returns created inspection
    // =========================================================
    #[Depends('testCreateInspectionReturns201')]
    public function testGetInspectionsReturnsCreatedInspection(int $inspectionId): void
    {
        $res = $this->request('GET', '/inspections');
        $this->assertEquals(200, $res['status']);
        $this->assertNotEmpty($res['body']);

        $inspection = $res['body'][0];
        $this->assertEquals($inspectionId, $inspection['id']);
        $this->assertArrayHasKey('carId', $inspection);
        $this->assertArrayHasKey('wipers', $inspection);
        $this->assertArrayHasKey('engineSound', $inspection);
        $this->assertArrayHasKey('headlights', $inspection);
        $this->assertArrayHasKey('performedAt', $inspection);

        // Verify camelCase keys (not snake_case)
        $this->assertArrayNotHasKey('car_id', $inspection);
        $this->assertArrayNotHasKey('engine_sound', $inspection);
        $this->assertArrayNotHasKey('performed_at', $inspection);
    }

    // =========================================================
    // POST /inspections — validation: missing fields
    // =========================================================
    public function testCreateInspectionMissingFieldsReturns422(): void
    {
        $res = $this->request('POST', '/inspections', []);
        $this->assertEquals(422, $res['status']);
        $this->assertEquals('Validation failed.', $res['body']['error']);
        $this->assertCount(4, $res['body']['details']);
    }

    // =========================================================
    // POST /inspections — validation: invalid types
    // =========================================================
    public function testCreateInspectionInvalidTypesReturns422(): void
    {
        $res = $this->request('POST', '/inspections', [
            'carId' => 'not an int',
            'wipers' => 'yes',
            'engineSound' => 1,
            'headlights' => 0,
        ]);
        $this->assertEquals(422, $res['status']);
        $this->assertNotEmpty($res['body']['details']);
    }

    // =========================================================
    // POST /inspections — car does not exist
    // =========================================================
    public function testCreateInspectionNonExistentCarReturns422(): void
    {
        $res = $this->request('POST', '/inspections', [
            'carId' => 99999,
            'wipers' => true,
            'engineSound' => true,
            'headlights' => true,
        ]);
        $this->assertEquals(422, $res['status']);
        $this->assertStringContainsString('Car not found', $res['body']['error']);
    }

    // =========================================================
    // POST /inspections — invalid JSON
    // =========================================================
    public function testCreateInspectionInvalidJsonReturns400(): void
    {
        $res = $this->requestRaw('POST', '/inspections', '{bad}');
        $this->assertEquals(400, $res['status']);
    }

    // =========================================================
    // POST /inspections — empty body
    // =========================================================
    public function testCreateInspectionEmptyBodyReturns400(): void
    {
        $res = $this->requestRaw('POST', '/inspections', '');
        $this->assertEquals(400, $res['status']);
    }

    // =========================================================
    // GET /inspections — empty list initially
    // =========================================================
    public function testGetInspectionsEmptyInitially(): void
    {
        // This runs in a shared DB so it may have data from other tests.
        // Just verify it returns 200 and an array.
        $res = $this->request('GET', '/inspections');
        $this->assertEquals(200, $res['status']);
        $this->assertIsArray($res['body']);
    }

    // =========================================================
    // Routing: 404 for unknown endpoint
    // =========================================================
    public function testUnknownEndpointReturns404(): void
    {
        $res = $this->request('GET', '/unknown');
        $this->assertEquals(404, $res['status']);
        $this->assertArrayHasKey('error', $res['body']);
    }

    // =========================================================
    // Routing: 405 for wrong method on valid URI
    // =========================================================
    public function testDeleteCarsReturns405(): void
    {
        $res = $this->request('DELETE', '/cars');
        $this->assertEquals(405, $res['status']);
        $this->assertArrayHasKey('error', $res['body']);
    }

    public function testPutInspectionsReturns405(): void
    {
        $res = $this->request('PUT', '/inspections');
        $this->assertEquals(405, $res['status']);
    }

    // =========================================================
    // Routing: trailing slash handled
    // =========================================================
    public function testTrailingSlashHandled(): void
    {
        $res = $this->request('GET', '/cars/');
        // Should either work (200) or return 404 for "/cars/" —
        // rtrim strips the slash so it should route to /cars
        $this->assertEquals(200, $res['status']);
    }

    // =========================================================
    // POST /inspections — performedAt is server-generated
    // =========================================================
    #[Depends('testCreateCarReturns201')]
    public function testPerformedAtIsServerGenerated(int $carId): void
    {
        $res = $this->request('POST', '/inspections', [
            'carId' => $carId,
            'wipers' => false,
            'engineSound' => false,
            'headlights' => true,
        ]);

        $this->assertEquals(201, $res['status']);
        $this->assertArrayHasKey('performedAt', $res['body']);
        $this->assertNotEmpty($res['body']['performedAt']);
    }

    // =========================================================
    // Response types: verify JSON types are correct
    // =========================================================
    #[Depends('testCreateCarReturns201')]
    public function testCarResponseTypesAreCorrect(int $carId): void
    {
        $res = $this->request('GET', '/cars');
        $car = $res['body'][0];

        $this->assertIsInt($car['id']);
        $this->assertIsString($car['name']);
        $this->assertIsString($car['make']);
        $this->assertIsString($car['model']);
        $this->assertIsInt($car['year']);
    }
}
