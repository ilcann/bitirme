<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);

        echo json_encode(array(
            'success' => false,
            'message' => 'Method not allowed.',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return;
    }

    $pdo = getCoursesPdo();
    requireAuthenticatedUser($pdo, array('ADMIN'));

    $body = readJsonRequestBody();
    $courseId = isset($body['id']) ? trim($body['id']) : '';

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $pdo->beginTransaction();

    try {
        $statement = $pdo->prepare('DELETE FROM course_enrollments WHERE course_id = :course_id');
        $statement->execute(array(':course_id' => $courseId));

        $statement = $pdo->prepare('DELETE FROM courses WHERE id = :course_id');
        $statement->execute(array(':course_id' => $courseId));

        $pdo->commit();
    } catch (Exception $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $exception;
    }

    echo json_encode(array(
        'success' => true,
        'message' => 'Course deleted successfully.',
        'course' => $course,
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
        'message' => 'Failed to delete course.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}