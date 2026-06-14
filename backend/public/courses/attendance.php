<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $courseId = isset($_GET['courseId']) ? trim($_GET['courseId']) : '';

    if ($courseId === '' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = readJsonRequestBody();
        if (isset($body['courseId'])) {
            $courseId = trim((string) $body['courseId']);
        }
    }

    if ($courseId === '') {
        http_response_code(400);

        echo json_encode(array(
            'success' => false,
            'message' => 'Course id is required.',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo json_encode(fetchCourseAttendance($courseId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = readJsonRequestBody();
        $studentId = isset($body['studentId']) ? (int) $body['studentId'] : 0;
        $weekNumber = isset($body['weekNumber']) ? (int) $body['weekNumber'] : 0;
        $isPresent = isset($body['isPresent']) ? (bool) $body['isPresent'] : false;

        echo json_encode(updateCourseAttendance($courseId, $studentId, $weekNumber, $isPresent), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    http_response_code(405);

    echo json_encode(array(
        'success' => false,
        'message' => 'Method not allowed.',
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (RuntimeException $exception) {
    $message = $exception->getMessage();
    $statusCode = 404;

    if ($message === 'Unauthorized.') {
        $statusCode = 401;
    } elseif ($message === 'Forbidden.') {
        $statusCode = 403;
    }

    http_response_code($statusCode);

    echo json_encode(array(
        'success' => false,
        'message' => $message,
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to load course attendance.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}