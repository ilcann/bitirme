<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/auth.php';

function normalizeCourse(array $course)
{
    return array(
        'id' => $course['id'],
        'code' => $course['code'],
        'title' => array(
            'tr' => $course['title_tr'],
            'en' => $course['title_en'],
        ),
        'students' => isset($course['students']) ? (int) $course['students'] : 0,
        'color' => $course['color'],
        'audience' => $course['audience'],
    );
}

function generateCourseId($code)
{
    $normalized = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '', $code));

    return $normalized;
}

function getCoursesPdo()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    return createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
}

function buildCourseFilters(array $filters)
{
    $where = array();
    $params = array();

    if (!empty($filters['audience'])) {
        $where[] = 'c.audience = :audience';
        $params[':audience'] = $filters['audience'];
    }

    if (!empty($filters['search'])) {
        $where[] = '(c.code LIKE :search OR c.title_tr LIKE :search OR c.title_en LIKE :search)';
        $params[':search'] = '%' . $filters['search'] . '%';
    }

    return array($where, $params);
}

function getCourseCount($pdo, array $filters = array())
{
    list($where, $params) = buildCourseFilters($filters);

    $sql = 'SELECT COUNT(*) AS total FROM courses c';

    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    $row = $statement->fetch();

    return $row ? (int) $row['total'] : 0;
}

function fetchCourses($filters)
{
    $pdo = getCoursesPdo();

    $offset = isset($filters['offset']) ? (int) $filters['offset'] : 0;
    $limit = isset($filters['limit']) ? (int) $filters['limit'] : 20;
    $sortBy = isset($filters['sortBy']) ? $filters['sortBy'] : 'students';

    list($where, $params) = buildCourseFilters($filters);

    $orderBy = 'students DESC, c.code ASC';

    switch ($sortBy) {
        case 'code':
            $orderBy = 'c.code ASC';
            break;
        case 'title':
            $orderBy = 'c.title_en ASC';
            break;
        case 'students':
        default:
            $orderBy = 'students DESC, c.code ASC';
            break;
    }

    $sql = '
        SELECT
            c.id,
            c.code,
            c.title_tr,
            c.title_en,
            c.color,
            c.audience,
            COALESCE(enrollment_counts.students, 0) AS students
        FROM courses c
        LEFT JOIN (
            SELECT course_id, COUNT(*) AS students
            FROM course_enrollments
            GROUP BY course_id
        ) enrollment_counts ON enrollment_counts.course_id = c.id';

    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $sql .= ' ORDER BY ' . $orderBy . ' LIMIT :limit OFFSET :offset';

    $statement = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $statement->bindValue($key, $value);
    }

    $statement->bindValue(':limit', $limit, PDO::PARAM_INT);
    $statement->bindValue(':offset', $offset, PDO::PARAM_INT);
    $statement->execute();

    $courses = array();

    while ($row = $statement->fetch()) {
        $courses[] = normalizeCourse($row);
    }

    return array(
        'data' => $courses,
        'total' => getCourseCount($pdo, $filters),
        'offset' => $offset,
        'limit' => $limit,
        'hasMore' => $offset + $limit < getCourseCount($pdo, $filters),
    );
}

function fetchCourseById($courseId)
{
    $pdo = getCoursesPdo();

    $statement = $pdo->prepare('
        SELECT
            c.id,
            c.code,
            c.title_tr,
            c.title_en,
            c.color,
            c.audience,
            COALESCE(enrollment_counts.students, 0) AS students
        FROM courses c
        LEFT JOIN (
            SELECT course_id, COUNT(*) AS students
            FROM course_enrollments
            GROUP BY course_id
        ) enrollment_counts ON enrollment_counts.course_id = c.id
        WHERE c.id = :course_id
        LIMIT 1
    ');
    $statement->execute(array(':course_id' => $courseId));

    $row = $statement->fetch();

    return $row ? normalizeCourse($row) : null;
}

function fetchCourseStudents($courseId, $sortBy = 'name')
{
    $pdo = getCoursesPdo();
    requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $orderBy = 'u.first_name ASC, u.last_name ASC, u.student_number ASC';

    if ($sortBy === 'studentNumber') {
        $orderBy = 'u.student_number ASC, u.first_name ASC, u.last_name ASC';
    }

    $statement = $pdo->prepare('
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.student_number,
            e.created_at AS enrolled_at
        FROM course_enrollments e
        INNER JOIN users u ON u.id = e.user_id
        WHERE e.course_id = :course_id
          AND u.role = \'STUDENT\'
          AND u.is_active = 1
        ORDER BY ' . $orderBy . '
    ');
    $statement->execute(array(':course_id' => $courseId));

    $students = array();

    while ($row = $statement->fetch()) {
        $students[] = array(
            'id' => (int) $row['id'],
            'email' => $row['email'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'studentNumber' => $row['student_number'],
            'enrolledAt' => $row['enrolled_at'],
        );
    }

    return array(
        'success' => true,
        'message' => 'Course students loaded successfully.',
        'course' => $course,
        'data' => $students,
        'total' => count($students),
    );
}

function fetchCompactCourses($audience = null)
{
    $pdo = getCoursesPdo();
    $sql = 'SELECT id, code, title_tr, title_en, color, audience FROM courses';
    $params = array();

    if (!empty($audience)) {
        $sql .= ' WHERE audience = :audience';
        $params[':audience'] = $audience;
    }

    $sql .= ' ORDER BY code ASC';

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    $courses = array();

    while ($row = $statement->fetch()) {
        $courses[] = array(
            'id' => $row['id'],
            'code' => $row['code'],
            'title' => array(
                'tr' => $row['title_tr'],
                'en' => $row['title_en'],
            ),
            'color' => $row['color'],
            'audience' => $row['audience'],
        );
    }

    return $courses;
}

function createCourse()
{
    $pdo = getCoursesPdo();
    $admin = requireAuthenticatedUser($pdo, array('ADMIN'));
    $body = readJsonRequestBody();

    $code = isset($body['code']) ? trim($body['code']) : '';
    $titleTr = isset($body['titleTr']) ? trim($body['titleTr']) : '';
    $titleEn = isset($body['titleEn']) ? trim($body['titleEn']) : '';
    $audience = isset($body['audience']) ? trim($body['audience']) : '';
    $color = isset($body['color']) ? trim($body['color']) : 'chart-1';

    if ($code === '' || $titleTr === '' || $titleEn === '' || $audience === '') {
        throw new InvalidArgumentException('Course code, titles and audience are required.');
    }

    if (!in_array($audience, array('common', 'department'), true)) {
        throw new InvalidArgumentException('Invalid course audience.');
    }

    $courseId = isset($body['id']) && trim($body['id']) !== '' ? trim($body['id']) : generateCourseId($code);

    $statement = $pdo->prepare('
        INSERT INTO courses (id, code, title_tr, title_en, color, audience, created_by)
        VALUES (:id, :code, :title_tr, :title_en, :color, :audience, :created_by)
    ');

    $statement->execute(array(
        ':id' => $courseId,
        ':code' => $code,
        ':title_tr' => $titleTr,
        ':title_en' => $titleEn,
        ':color' => $color,
        ':audience' => $audience,
        ':created_by' => $admin['id'],
    ));

    $course = fetchCourseById($courseId);

    return array(
        'success' => true,
        'message' => 'Course created successfully.',
        'course' => $course,
    );
}

function deleteCourse($courseId)
{
    $pdo = getCoursesPdo();
    requireAuthenticatedUser($pdo, array('ADMIN'));

    $courseId = trim($courseId);

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

    return array(
        'success' => true,
        'message' => 'Course deleted successfully.',
        'course' => $course,
    );
}