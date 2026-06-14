<?php

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $tester = 'testDatabaseConnection';

    echo json_encode(call_user_func($tester), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Database connection failed.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}