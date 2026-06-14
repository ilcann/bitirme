<?php

require_once __DIR__ . '/../../src/courses.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($_GET['courseId']) || trim($_GET['courseId']) === '') {
        http_response_code(400);

        echo json_encode(array(
            'success' => false,
            'message' => 'Course id is required.',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    $pdo = getCoursesPdo();
    requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = trim($_GET['courseId']);
    $offset = isset($_GET['offset']) ? max(0, (int) $_GET['offset']) : 0;
    $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 20;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $course = fetchCourseById($courseId);

    if (!$course) {
        http_response_code(404);

        echo json_encode(array(
            'success' => false,
            'message' => 'Course not found.',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    $sql = '
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.student_number
        FROM users u
        WHERE u.role = \'STUDENT\'
          AND u.is_active = 1
          AND NOT EXISTS (
              SELECT 1
              FROM course_enrollments e
              WHERE e.course_id = :course_id
                AND e.user_id = u.id
          )';

    $params = array(':course_id' => $courseId);

    if ($search !== '') {
        $sql .= ' AND (u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search OR u.student_number LIKE :search)';
        $params[':search'] = '%' . $search . '%';
    }

    $sql .= ' ORDER BY u.first_name ASC, u.last_name ASC, u.student_number ASC';

    $countSql = '
        SELECT COUNT(*) AS total
        FROM users u
        WHERE u.role = \'STUDENT\'
          AND u.is_active = 1
          AND NOT EXISTS (
              SELECT 1
              FROM course_enrollments e
              WHERE e.course_id = :course_id
                AND e.user_id = u.id
          )';

    $countParams = array(':course_id' => $courseId);

    if ($search !== '') {
        $countSql .= ' AND (u.first_name LIKE :search OR u.last_name LIKE :search OR u.email LIKE :search OR u.student_number LIKE :search)';
        $countParams[':search'] = '%' . $search . '%';
    }

    $countStatement = $pdo->prepare($countSql);
    $countStatement->execute($countParams);
    $total = (int) $countStatement->fetchColumn();

    $sql .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    $students = array();

    while ($row = $statement->fetch()) {
        $students[] = array(
            'id' => (int) $row['id'],
            'email' => $row['email'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'studentNumber' => $row['student_number'],
        );
    }

    echo json_encode(array(
        'success' => true,
        'message' => 'Available students loaded successfully.',
        'course' => $course,
        'data' => $students,
        'total' => $total,
        'offset' => $offset,
        'limit' => $limit,
        'hasMore' => ($offset + count($students)) < $total,
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (InvalidArgumentException $exception) {
    http_response_code(400);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (RuntimeException $exception) {
    http_response_code($exception->getMessage() === 'Unauthorized.' ? 401 : 404);

    echo json_encode(array(
        'success' => false,
        'message' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to load available students.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}