<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if (isset($_GET['students']) && $_GET['students'] === '1' && isset($_GET['courseId']) && trim($_GET['courseId']) !== '') {
        echo json_encode(fetchCourseStudents(trim($_GET['courseId']), isset($_GET['sortBy']) ? trim($_GET['sortBy']) : 'name'), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if (isset($_GET['courseId']) && trim($_GET['courseId']) !== '') {
        $course = fetchCourseById(trim($_GET['courseId']));

        if (!$course) {
            http_response_code(404);

            echo json_encode(array(
                'success' => false,
                'message' => 'Course not found.',
            ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            return;
        }

        echo json_encode(array(
            'success' => true,
            'message' => 'Course loaded successfully.',
            'course' => $course,
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if (isset($_GET['compact']) && $_GET['compact'] === '1') {
        echo json_encode(array(
            'success' => true,
            'message' => 'Compact courses loaded successfully.',
            'data' => fetchCompactCourses(isset($_GET['audience']) ? trim($_GET['audience']) : null),
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;
    $audience = isset($_GET['audience']) ? trim($_GET['audience']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;
    $sortBy = isset($_GET['sortBy']) ? trim($_GET['sortBy']) : 'students';

    echo json_encode(array(
        'success' => true,
        'message' => 'Courses loaded successfully.',
        'data' => fetchCourses(array(
            'audience' => $audience,
            'offset' => $offset,
            'limit' => $limit,
            'search' => $search,
            'sortBy' => $sortBy,
        )),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to load courses.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}