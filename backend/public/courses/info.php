<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $courseId = isset($_GET['courseId']) ? trim($_GET['courseId']) : '';

        echo json_encode(updateCourseInfo($courseId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);

        echo json_encode(array(
            'success' => false,
            'message' => 'Method not allowed.',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    $courseId = isset($_GET['courseId']) ? trim($_GET['courseId']) : '';

    echo json_encode(fetchCourseInfo($courseId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (RuntimeException $exception) {
    $statusCode = 500;

    if ($exception->getMessage() === 'Course not found.') {
        $statusCode = 404;
    } elseif ($exception->getMessage() === 'Unauthorized.') {
        $statusCode = 401;
    } elseif ($exception->getMessage() === 'Forbidden.') {
        $statusCode = 403;
    }

    http_response_code($statusCode);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to load course info.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}