<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

function readEnrollRequestBody()
{
    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        return $_POST;
    }

    $decoded = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        return $_POST;
    }

    return $decoded;
}

try {
    $body = readEnrollRequestBody();
    $courseId = isset($body['courseId']) ? trim((string) $body['courseId']) : '';
    $studentIds = isset($body['studentIds']) && is_array($body['studentIds']) ? $body['studentIds'] : array();

    echo json_encode(enrollStudentsToCourse($courseId, $studentIds), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (RuntimeException $exception) {
    $statusCode = $exception->getMessage() === 'Unauthorized.' ? 401 : 404;

    http_response_code($statusCode);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to enroll students.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}