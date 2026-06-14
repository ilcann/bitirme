<?php

require_once __DIR__ . '/../../src/auth.php';

header('Content-Type: application/json; charset=utf-8');

try {
    echo json_encode(loginUser(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (RuntimeException $exception) {
    http_response_code(401);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Login failed.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}