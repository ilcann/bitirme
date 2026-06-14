<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/auth.php';

if (!defined('COURSE_ATTENDANCE_WEEK_COUNT')) {
    define('COURSE_ATTENDANCE_WEEK_COUNT', 14);
}

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
        'info' => buildCourseInfo($course),
    );
}

function splitCourseInfoLines($value)
{
    $value = trim((string) $value);

    if ($value === '') {
        return array();
    }

    $separatorPattern = '/\r\n|\r|\n|\s*,\s*|\s*;\s*/';
    $items = preg_split($separatorPattern, $value);
    $normalized = array();

    if (!is_array($items)) {
        return $normalized;
    }

    foreach ($items as $item) {
        $item = trim((string) $item);

        if ($item === '') {
            continue;
        }

        $normalized[] = $item;
    }

    return $normalized;
}

function normalizeNullableCourseInfoText($value)
{
    $value = trim((string) $value);

    return $value === '' ? null : $value;
}

function normalizeCourseInfoListValue($value)
{
    if (is_array($value)) {
        $items = array();

        foreach ($value as $item) {
            $item = trim((string) $item);

            if ($item === '') {
                continue;
            }

            $items[] = $item;
        }

        return !empty($items) ? implode("\n", $items) : null;
    }

    $value = trim((string) $value);

    return $value === '' ? null : $value;
}

function normalizeCourseInfoDateValue($value)
{
    $value = trim((string) $value);

    if ($value === '') {
        return null;
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        throw new InvalidArgumentException('Date fields must use YYYY-MM-DD format.');
    }

    return $value;
}

function buildCourseInfo(array $course)
{
    $hasInfoField = array_key_exists('summary_tr', $course)
        || array_key_exists('summary_en', $course)
        || array_key_exists('section_name', $course)
        || array_key_exists('crn', $course)
        || array_key_exists('term_tr', $course)
        || array_key_exists('term_en', $course)
        || array_key_exists('start_date', $course)
        || array_key_exists('end_date', $course)
        || array_key_exists('last_access_date', $course)
        || array_key_exists('instructors', $course)
        || array_key_exists('assistants', $course)
        || array_key_exists('schedule_tr', $course)
        || array_key_exists('schedule_en', $course);

    if (!$hasInfoField) {
        return null;
    }

    return array(
        'summary' => array(
            'tr' => isset($course['summary_tr']) && $course['summary_tr'] !== '' ? $course['summary_tr'] : null,
            'en' => isset($course['summary_en']) && $course['summary_en'] !== '' ? $course['summary_en'] : null,
        ),
        'sectionName' => isset($course['section_name']) && $course['section_name'] !== '' ? $course['section_name'] : null,
        'crn' => isset($course['crn']) && $course['crn'] !== '' ? $course['crn'] : null,
        'term' => array(
            'tr' => isset($course['term_tr']) && $course['term_tr'] !== '' ? $course['term_tr'] : null,
            'en' => isset($course['term_en']) && $course['term_en'] !== '' ? $course['term_en'] : null,
        ),
        'startDate' => isset($course['start_date']) && $course['start_date'] !== '' ? $course['start_date'] : null,
        'endDate' => isset($course['end_date']) && $course['end_date'] !== '' ? $course['end_date'] : null,
        'lastAccessDate' => isset($course['last_access_date']) && $course['last_access_date'] !== '' ? $course['last_access_date'] : null,
        'instructors' => splitCourseInfoLines(isset($course['instructors']) ? $course['instructors'] : ''),
        'assistants' => splitCourseInfoLines(isset($course['assistants']) ? $course['assistants'] : ''),
        'schedule' => array(
            'tr' => splitCourseInfoLines(isset($course['schedule_tr']) ? $course['schedule_tr'] : ''),
            'en' => splitCourseInfoLines(isset($course['schedule_en']) ? $course['schedule_en'] : ''),
        ),
    );
}

function ensureCourseInfoSchema($pdo)
{
    $columns = array(
        'summary_tr' => 'TEXT NULL',
        'summary_en' => 'TEXT NULL',
        'section_name' => 'VARCHAR(120) DEFAULT NULL',
        'crn' => 'VARCHAR(50) DEFAULT NULL',
        'term_tr' => 'VARCHAR(120) DEFAULT NULL',
        'term_en' => 'VARCHAR(120) DEFAULT NULL',
        'start_date' => 'DATE DEFAULT NULL',
        'end_date' => 'DATE DEFAULT NULL',
        'last_access_date' => 'DATE DEFAULT NULL',
        'instructors' => 'TEXT NULL',
        'assistants' => 'TEXT NULL',
        'schedule_tr' => 'TEXT NULL',
        'schedule_en' => 'TEXT NULL'
    );

    foreach ($columns as $columnName => $columnDefinition) {
        $columnResult = $pdo->query("SHOW COLUMNS FROM courses LIKE '{$columnName}'");

        if (!$columnResult || !$columnResult->fetch()) {
            $pdo->exec("ALTER TABLE courses ADD COLUMN {$columnName} {$columnDefinition}");
        }
    }
}

function getCourseGradeTypes()
{
    return array(
        array('key' => 'midterm', 'label' => 'Midterm', 'defaultCount' => 2, 'defaultWeight' => 40),
        array('key' => 'final', 'label' => 'Final', 'defaultCount' => 1, 'defaultWeight' => 30),
        array('key' => 'project', 'label' => 'Project', 'defaultCount' => 2, 'defaultWeight' => 10),
        array('key' => 'homework', 'label' => 'Homework', 'defaultCount' => 14, 'defaultWeight' => 10),
        array('key' => 'quiz', 'label' => 'Quiz', 'defaultCount' => 14, 'defaultWeight' => 10),
    );
}

function getDefaultCourseGradeDistribution()
{
    $distribution = array();

    foreach (getCourseGradeTypes() as $type) {
        $distribution[$type['key'] . 'Count'] = $type['defaultCount'];
        $distribution[$type['key'] . 'Weight'] = $type['defaultWeight'];
    }

    return $distribution;
}

function ensureCourseGradeSchema($pdo)
{
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS course_grade_distributions (
            course_id VARCHAR(50) PRIMARY KEY,
            midterm_count TINYINT UNSIGNED NOT NULL DEFAULT 2,
            final_count TINYINT UNSIGNED NOT NULL DEFAULT 1,
            project_count TINYINT UNSIGNED NOT NULL DEFAULT 2,
            homework_count TINYINT UNSIGNED NOT NULL DEFAULT 14,
            quiz_count TINYINT UNSIGNED NOT NULL DEFAULT 14,
            midterm_weight TINYINT UNSIGNED NOT NULL DEFAULT 40,
            final_weight TINYINT UNSIGNED NOT NULL DEFAULT 30,
            project_weight TINYINT UNSIGNED NOT NULL DEFAULT 10,
            homework_weight TINYINT UNSIGNED NOT NULL DEFAULT 10,
            quiz_weight TINYINT UNSIGNED NOT NULL DEFAULT 10,
            updated_by INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
    ');

    $weightColumns = array(
        'midterm_weight' => 'TINYINT UNSIGNED NOT NULL DEFAULT 40',
        'final_weight' => 'TINYINT UNSIGNED NOT NULL DEFAULT 30',
        'project_weight' => 'TINYINT UNSIGNED NOT NULL DEFAULT 10',
        'homework_weight' => 'TINYINT UNSIGNED NOT NULL DEFAULT 10',
        'quiz_weight' => 'TINYINT UNSIGNED NOT NULL DEFAULT 10',
    );

    foreach ($weightColumns as $columnName => $columnDefinition) {
        $columnResult = $pdo->query("SHOW COLUMNS FROM course_grade_distributions LIKE '{$columnName}'");

        if (!$columnResult || !$columnResult->fetch()) {
            $pdo->exec("ALTER TABLE course_grade_distributions ADD COLUMN {$columnName} {$columnDefinition}");
        }
    }

    $pdo->exec('
        CREATE TABLE IF NOT EXISTS course_grade_scores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id VARCHAR(50) NOT NULL,
            user_id INT NOT NULL,
            item_type ENUM(\'midterm\', \'final\', \'project\', \'homework\', \'quiz\') NOT NULL,
            item_number TINYINT UNSIGNED NOT NULL,
            score DECIMAL(5,2) NULL DEFAULT NULL,
            updated_by INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_course_user_item (course_id, user_id, item_type, item_number),
            INDEX idx_course_grade_scores_course_id (course_id),
            INDEX idx_course_grade_scores_user_id (user_id),
            INDEX idx_course_grade_scores_item_type (item_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
    ');
}

function normalizeCourseGradeDistribution(array $distribution)
{
    $normalized = array();

    foreach (getCourseGradeTypes() as $type) {
        $fieldName = $type['key'] . 'Count';
        $count = isset($distribution[$fieldName]) ? (int) $distribution[$fieldName] : $type['defaultCount'];
        $weightFieldName = $type['key'] . 'Weight';
        $weight = isset($distribution[$weightFieldName]) ? (int) $distribution[$weightFieldName] : $type['defaultWeight'];

        if ($count < 0) {
            $count = 0;
        }

        if ($weight < 0) {
            $weight = 0;
        }

        if ($weight > 100) {
            $weight = 100;
        }

        if ($count === 0) {
            $weight = 0;
        }

        $normalized[$fieldName] = $count;
        $normalized[$weightFieldName] = $weight;
    }

    return $normalized;
}

function buildCourseGradeSlots(array $distribution)
{
    $slots = array();

    foreach (getCourseGradeTypes() as $type) {
        $fieldName = $type['key'] . 'Count';
        $count = isset($distribution[$fieldName]) ? (int) $distribution[$fieldName] : 0;

        for ($index = 1; $index <= $count; $index++) {
            $slots[] = array(
                'itemType' => $type['key'],
                'itemNumber' => $index,
            );
        }
    }

    return $slots;
}

function normalizeCourseGradeStudent(array $student, array $distribution)
{
    $slots = buildCourseGradeSlots($distribution);
    $grades = array();
    $groupScoreStats = array();

    foreach (getCourseGradeTypes() as $type) {
        $groupScoreStats[$type['key']] = array(
            'sum' => 0,
            'count' => 0,
        );
    }

    foreach ($slots as $slot) {
        $grades[$slot['itemType'] . ':' . $slot['itemNumber']] = array(
            'itemType' => $slot['itemType'],
            'itemNumber' => $slot['itemNumber'],
            'score' => null,
            'updatedAt' => null,
        );
    }

    if (isset($student['grades']) && is_array($student['grades'])) {
        foreach ($student['grades'] as $grade) {
            if (!isset($grade['itemType']) || !isset($grade['itemNumber'])) {
                continue;
            }

            $gradeKey = $grade['itemType'] . ':' . (int) $grade['itemNumber'];

            if (!isset($grades[$gradeKey])) {
                continue;
            }

            $score = isset($grade['score']) && $grade['score'] !== null ? (float) $grade['score'] : null;
            $grades[$gradeKey]['score'] = $score;
            $grades[$gradeKey]['updatedAt'] = isset($grade['updatedAt']) ? $grade['updatedAt'] : null;

            if ($score !== null) {
                $groupScoreStats[$grade['itemType']]['sum'] += $score;
                $groupScoreStats[$grade['itemType']]['count']++;
            }
        }
    }

    $weightedSum = 0;
    $appliedWeightSum = 0;

    foreach (getCourseGradeTypes() as $type) {
        $key = $type['key'];
        $countField = $key . 'Count';
        $weightField = $key . 'Weight';
        $slotCount = isset($distribution[$countField]) ? (int) $distribution[$countField] : 0;
        $weight = isset($distribution[$weightField]) ? (float) $distribution[$weightField] : 0;

        if ($slotCount <= 0 || $weight <= 0) {
            continue;
        }

        $groupCount = $groupScoreStats[$key]['count'];

        if ($groupCount <= 0) {
            continue;
        }

        $groupAverage = $groupScoreStats[$key]['sum'] / $groupCount;
        $weightedSum += $groupAverage * $weight;
        $appliedWeightSum += $weight;
    }

    return array(
        'id' => (int) $student['id'],
        'email' => $student['email'],
        'firstName' => $student['firstName'],
        'lastName' => $student['lastName'],
        'studentNumber' => $student['studentNumber'],
        'enrolledAt' => $student['enrolledAt'],
        'grades' => array_values($grades),
        'averageScore' => $appliedWeightSum > 0 ? round($weightedSum / $appliedWeightSum, 1) : null,
    );
}

function fetchCourseGradeDistributionRow($pdo, $courseId)
{
    ensureCourseGradeSchema($pdo);

    $statement = $pdo->prepare('SELECT midterm_count, final_count, project_count, homework_count, quiz_count, midterm_weight, final_weight, project_weight, homework_weight, quiz_weight FROM course_grade_distributions WHERE course_id = :course_id LIMIT 1');
    $statement->execute(array(':course_id' => $courseId));

    $row = $statement->fetch();

    if ($row) {
        return normalizeCourseGradeDistribution(array(
            'midtermCount' => $row['midterm_count'],
            'finalCount' => $row['final_count'],
            'projectCount' => $row['project_count'],
            'homeworkCount' => $row['homework_count'],
            'quizCount' => $row['quiz_count'],
            'midtermWeight' => $row['midterm_weight'],
            'finalWeight' => $row['final_weight'],
            'projectWeight' => $row['project_weight'],
            'homeworkWeight' => $row['homework_weight'],
            'quizWeight' => $row['quiz_weight'],
        ));
    }

    $defaults = getDefaultCourseGradeDistribution();
    $insertStatement = $pdo->prepare('INSERT INTO course_grade_distributions (course_id, midterm_count, final_count, project_count, homework_count, quiz_count, midterm_weight, final_weight, project_weight, homework_weight, quiz_weight) VALUES (:course_id, :midterm_count, :final_count, :project_count, :homework_count, :quiz_count, :midterm_weight, :final_weight, :project_weight, :homework_weight, :quiz_weight)');
    $insertStatement->execute(array(
        ':course_id' => $courseId,
        ':midterm_count' => $defaults['midtermCount'],
        ':final_count' => $defaults['finalCount'],
        ':project_count' => $defaults['projectCount'],
        ':homework_count' => $defaults['homeworkCount'],
        ':quiz_count' => $defaults['quizCount'],
        ':midterm_weight' => $defaults['midtermWeight'],
        ':final_weight' => $defaults['finalWeight'],
        ':project_weight' => $defaults['projectWeight'],
        ':homework_weight' => $defaults['homeworkWeight'],
        ':quiz_weight' => $defaults['quizWeight'],
    ));

    return $defaults;
}

function fetchCourseGradeClassAverages($pdo, $courseId, array $distribution)
{
    $slots = buildCourseGradeSlots($distribution);
    $itemAverages = array();

    foreach ($slots as $slot) {
        $itemAverages[$slot['itemType'] . ':' . $slot['itemNumber']] = null;
    }

    $itemStatement = $pdo->prepare('
        SELECT
            g.item_type,
            g.item_number,
            AVG(g.score) AS avg_score
        FROM course_enrollments e
        INNER JOIN users u ON u.id = e.user_id
        INNER JOIN course_grade_scores g ON g.course_id = e.course_id AND g.user_id = e.user_id
        WHERE e.course_id = :course_id
          AND u.role = \'STUDENT\'
          AND u.is_active = 1
          AND g.score IS NOT NULL
        GROUP BY g.item_type, g.item_number
    ');
    $itemStatement->execute(array(':course_id' => $courseId));

    while ($row = $itemStatement->fetch()) {
        $averageKey = $row['item_type'] . ':' . (int) $row['item_number'];

        if (!array_key_exists($averageKey, $itemAverages)) {
            continue;
        }

        $itemAverages[$averageKey] = $row['avg_score'] !== null ? round((float) $row['avg_score'], 1) : null;
    }

    $typeAverages = array();

    foreach (getCourseGradeTypes() as $type) {
        $typeAverages[$type['key']] = null;
    }

    $typeStatement = $pdo->prepare('
        SELECT
            g.item_type,
            AVG(g.score) AS avg_score
        FROM course_enrollments e
        INNER JOIN users u ON u.id = e.user_id
        INNER JOIN course_grade_scores g ON g.course_id = e.course_id AND g.user_id = e.user_id
        WHERE e.course_id = :course_id
          AND u.role = \'STUDENT\'
          AND u.is_active = 1
          AND g.score IS NOT NULL
        GROUP BY g.item_type
    ');
    $typeStatement->execute(array(':course_id' => $courseId));

    while ($row = $typeStatement->fetch()) {
        $itemType = $row['item_type'];

        if (!array_key_exists($itemType, $typeAverages)) {
            continue;
        }

        $typeAverages[$itemType] = $row['avg_score'] !== null ? (float) $row['avg_score'] : null;
    }

    $weightedSum = 0;
    $appliedWeightSum = 0;

    foreach (getCourseGradeTypes() as $type) {
        $typeKey = $type['key'];
        $countField = $typeKey . 'Count';
        $weightField = $typeKey . 'Weight';
        $slotCount = isset($distribution[$countField]) ? (int) $distribution[$countField] : 0;
        $weight = isset($distribution[$weightField]) ? (float) $distribution[$weightField] : 0;
        $typeAverage = $typeAverages[$typeKey];

        if ($slotCount <= 0 || $weight <= 0 || $typeAverage === null) {
            continue;
        }

        $weightedSum += $typeAverage * $weight;
        $appliedWeightSum += $weight;
    }

    $items = array();

    foreach ($slots as $slot) {
        $averageKey = $slot['itemType'] . ':' . $slot['itemNumber'];
        $items[] = array(
            'itemType' => $slot['itemType'],
            'itemNumber' => $slot['itemNumber'],
            'averageScore' => $itemAverages[$averageKey],
        );
    }

    return array(
        'overall' => $appliedWeightSum > 0 ? round($weightedSum / $appliedWeightSum, 1) : null,
        'items' => $items,
    );
}

function fetchCourseGrades($courseId)
{
    $pdo = getCoursesPdo();
    $viewer = requireAuthenticatedUser($pdo);
    ensureCourseGradeSchema($pdo);

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $distribution = fetchCourseGradeDistributionRow($pdo, $courseId);

    $sql = '
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.student_number,
            e.created_at AS enrolled_at,
            g.item_type,
            g.item_number,
            g.score,
            g.updated_at
        FROM course_enrollments e
        INNER JOIN users u ON u.id = e.user_id
        LEFT JOIN course_grade_scores g ON g.course_id = e.course_id AND g.user_id = e.user_id
        WHERE e.course_id = :course_id
          AND u.role = \'STUDENT\'
                    AND u.is_active = 1';

        $params = array(':course_id' => $courseId);

        if (strtoupper((string) $viewer['role']) === 'STUDENT') {
                $sql .= ' AND u.id = :viewer_id';
                $params[':viewer_id'] = $viewer['id'];
        }

        $sql .= ' ORDER BY u.first_name ASC, u.last_name ASC, u.student_number ASC, g.item_type ASC, g.item_number ASC';

        $statement = $pdo->prepare($sql);
        $statement->execute($params);

    $students = array();

    while ($row = $statement->fetch()) {
        $studentId = (int) $row['id'];

        if (!isset($students[$studentId])) {
            $students[$studentId] = array(
                'id' => $studentId,
                'email' => $row['email'],
                'firstName' => $row['first_name'],
                'lastName' => $row['last_name'],
                'studentNumber' => $row['student_number'],
                'enrolledAt' => $row['enrolled_at'],
                'grades' => array(),
            );
        }

        if ($row['item_type'] === null || $row['item_number'] === null) {
            continue;
        }

        $students[$studentId]['grades'][] = array(
            'itemType' => $row['item_type'],
            'itemNumber' => (int) $row['item_number'],
            'score' => $row['score'] !== null ? (float) $row['score'] : null,
            'updatedAt' => $row['updated_at'],
        );
    }

    $rows = array();

    foreach ($students as $student) {
        $rows[] = normalizeCourseGradeStudent($student, $distribution);
    }

    $classAverages = fetchCourseGradeClassAverages($pdo, $courseId, $distribution);

    return array(
        'success' => true,
        'message' => 'Course grades loaded successfully.',
        'course' => $course,
        'distribution' => $distribution,
        'classAverages' => $classAverages,
        'data' => $rows,
        'total' => count($rows),
    );
}

function updateCourseGradeDistribution($courseId, array $distribution)
{
    $pdo = getCoursesPdo();
    $actor = requireAuthenticatedUser($pdo, array('ADMIN'));
    ensureCourseGradeSchema($pdo);

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $normalizedDistribution = normalizeCourseGradeDistribution($distribution);
    $totalItems = 0;
    $totalWeight = 0;

    foreach (getCourseGradeTypes() as $type) {
        $countField = $type['key'] . 'Count';
        $weightField = $type['key'] . 'Weight';
        $countValue = (int) $normalizedDistribution[$countField];

        $totalItems += $countValue;

        if ($countValue > 0) {
            $totalWeight += (int) $normalizedDistribution[$weightField];
        }
    }

    if ($totalItems <= 0) {
        throw new InvalidArgumentException('At least one grade item must be configured.');
    }

    if ($totalWeight !== 100) {
        throw new InvalidArgumentException('Grade weights must total 100%.');
    }

    $statement = $pdo->prepare('INSERT INTO course_grade_distributions (course_id, midterm_count, final_count, project_count, homework_count, quiz_count, midterm_weight, final_weight, project_weight, homework_weight, quiz_weight, updated_by) VALUES (:course_id, :midterm_count, :final_count, :project_count, :homework_count, :quiz_count, :midterm_weight, :final_weight, :project_weight, :homework_weight, :quiz_weight, :updated_by) ON DUPLICATE KEY UPDATE midterm_count = VALUES(midterm_count), final_count = VALUES(final_count), project_count = VALUES(project_count), homework_count = VALUES(homework_count), quiz_count = VALUES(quiz_count), midterm_weight = VALUES(midterm_weight), final_weight = VALUES(final_weight), project_weight = VALUES(project_weight), homework_weight = VALUES(homework_weight), quiz_weight = VALUES(quiz_weight), updated_by = VALUES(updated_by), updated_at = CURRENT_TIMESTAMP');
    $statement->execute(array(
        ':course_id' => $courseId,
        ':midterm_count' => $normalizedDistribution['midtermCount'],
        ':final_count' => $normalizedDistribution['finalCount'],
        ':project_count' => $normalizedDistribution['projectCount'],
        ':homework_count' => $normalizedDistribution['homeworkCount'],
        ':quiz_count' => $normalizedDistribution['quizCount'],
        ':midterm_weight' => $normalizedDistribution['midtermWeight'],
        ':final_weight' => $normalizedDistribution['finalWeight'],
        ':project_weight' => $normalizedDistribution['projectWeight'],
        ':homework_weight' => $normalizedDistribution['homeworkWeight'],
        ':quiz_weight' => $normalizedDistribution['quizWeight'],
        ':updated_by' => $actor['id'],
    ));

    return array(
        'success' => true,
        'message' => 'Course grade distribution updated successfully.',
        'course' => $course,
        'distribution' => $normalizedDistribution,
    );
}

function updateCourseGrade($courseId, $studentId, $itemType, $itemNumber, $score)
{
    $pdo = getCoursesPdo();
    $actor = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));
    ensureCourseGradeSchema($pdo);

    $courseId = trim($courseId);
    $studentId = (int) $studentId;
    $itemType = trim($itemType);
    $itemNumber = (int) $itemNumber;

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    if ($studentId <= 0) {
        throw new InvalidArgumentException('Student id is required.');
    }

    if ($itemType === '') {
        throw new InvalidArgumentException('Grade type is required.');
    }

    if ($itemNumber <= 0) {
        throw new InvalidArgumentException('Grade item number is required.');
    }

    $distribution = fetchCourseGradeDistributionRow($pdo, $courseId);
    $distributionField = $itemType . 'Count';

    if (!isset($distribution[$distributionField])) {
        throw new InvalidArgumentException('Invalid grade type.');
    }

    if ($itemNumber > (int) $distribution[$distributionField]) {
        throw new InvalidArgumentException('Grade item is outside the configured distribution.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $studentStatement = $pdo->prepare('SELECT u.id FROM course_enrollments e INNER JOIN users u ON u.id = e.user_id WHERE e.course_id = :course_id AND e.user_id = :student_id AND u.role = \'STUDENT\' AND u.is_active = 1 LIMIT 1');
    $studentStatement->execute(array(
        ':course_id' => $courseId,
        ':student_id' => $studentId,
    ));

    if (!$studentStatement->fetch()) {
        throw new RuntimeException('Student is not enrolled in this course.');
    }

    $normalizedScore = null;

    if ($score !== null && $score !== '') {
        $normalizedScore = (float) $score;

        if ($normalizedScore < 0 || $normalizedScore > 100) {
            throw new InvalidArgumentException('Grade score must be between 0 and 100.');
        }
    }

    $statement = $pdo->prepare('INSERT INTO course_grade_scores (course_id, user_id, item_type, item_number, score, updated_by) VALUES (:course_id, :user_id, :item_type, :item_number, :score, :updated_by) ON DUPLICATE KEY UPDATE score = VALUES(score), updated_by = VALUES(updated_by), updated_at = CURRENT_TIMESTAMP');
    $statement->execute(array(
        ':course_id' => $courseId,
        ':user_id' => $studentId,
        ':item_type' => $itemType,
        ':item_number' => $itemNumber,
        ':score' => $normalizedScore,
        ':updated_by' => $actor['id'],
    ));

    return array(
        'success' => true,
        'message' => 'Course grade updated successfully.',
        'course' => $course,
        'itemType' => $itemType,
        'itemNumber' => $itemNumber,
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
    ensureCourseInfoSchema($pdo);

    $statement = $pdo->prepare('
        SELECT
            c.id,
            c.code,
            c.title_tr,
            c.title_en,
            c.color,
            c.audience,
            c.summary_tr,
            c.summary_en,
            c.section_name,
            c.crn,
            c.term_tr,
            c.term_en,
            c.start_date,
            c.end_date,
            c.last_access_date,
            c.instructors,
            c.assistants,
            c.schedule_tr,
            c.schedule_en,
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

function fetchCourseInfo($courseId)
{
    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    return array(
        'success' => true,
        'message' => 'Course info loaded successfully.',
        'course' => $course,
    );
}

function updateCourseInfo($courseId)
{
    $pdo = getCoursesPdo();
    $admin = requireAuthenticatedUser($pdo, array('ADMIN'));
    $body = readJsonRequestBody();

    ensureCourseInfoSchema($pdo);

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $info = isset($body['info']) && is_array($body['info']) ? $body['info'] : array();
    $summary = isset($info['summary']) && is_array($info['summary']) ? $info['summary'] : array();
    $term = isset($info['term']) && is_array($info['term']) ? $info['term'] : array();
    $schedule = isset($info['schedule']) && is_array($info['schedule']) ? $info['schedule'] : array();

    $statement = $pdo->prepare('
        UPDATE courses
        SET
            summary_tr = :summary_tr,
            summary_en = :summary_en,
            section_name = :section_name,
            crn = :crn,
            term_tr = :term_tr,
            term_en = :term_en,
            start_date = :start_date,
            end_date = :end_date,
            last_access_date = :last_access_date,
            instructors = :instructors,
            assistants = :assistants,
            schedule_tr = :schedule_tr,
            schedule_en = :schedule_en,
            created_by = COALESCE(created_by, :updated_by)
        WHERE id = :course_id
        LIMIT 1
    ');
    $statement->execute(array(
        ':summary_tr' => normalizeNullableCourseInfoText(isset($summary['tr']) ? $summary['tr'] : ''),
        ':summary_en' => normalizeNullableCourseInfoText(isset($summary['en']) ? $summary['en'] : ''),
        ':section_name' => normalizeNullableCourseInfoText(isset($info['sectionName']) ? $info['sectionName'] : ''),
        ':crn' => normalizeNullableCourseInfoText(isset($info['crn']) ? $info['crn'] : ''),
        ':term_tr' => normalizeNullableCourseInfoText(isset($term['tr']) ? $term['tr'] : ''),
        ':term_en' => normalizeNullableCourseInfoText(isset($term['en']) ? $term['en'] : ''),
        ':start_date' => normalizeCourseInfoDateValue(isset($info['startDate']) ? $info['startDate'] : ''),
        ':end_date' => normalizeCourseInfoDateValue(isset($info['endDate']) ? $info['endDate'] : ''),
        ':last_access_date' => normalizeCourseInfoDateValue(isset($info['lastAccessDate']) ? $info['lastAccessDate'] : ''),
        ':instructors' => normalizeCourseInfoListValue(isset($info['instructors']) ? $info['instructors'] : ''),
        ':assistants' => normalizeCourseInfoListValue(isset($info['assistants']) ? $info['assistants'] : ''),
        ':schedule_tr' => normalizeCourseInfoListValue(isset($schedule['tr']) ? $schedule['tr'] : ''),
        ':schedule_en' => normalizeCourseInfoListValue(isset($schedule['en']) ? $schedule['en'] : ''),
        ':updated_by' => $admin['id'],
        ':course_id' => $courseId,
    ));

    return array(
        'success' => true,
        'message' => 'Course info updated successfully.',
        'course' => fetchCourseById($courseId),
    );
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

function buildAttendanceWeekItems()
{
    $weeks = array();

    for ($week = 1; $week <= COURSE_ATTENDANCE_WEEK_COUNT; $week++) {
        $weeks[] = array(
            'weekNumber' => $week,
            'isPresent' => null,
            'updatedAt' => null,
        );
    }

    return $weeks;
}

function summarizeAttendanceWeeks(array $weeks)
{
    $presentCount = 0;
    $absentCount = 0;

    foreach ($weeks as $week) {
        if (!isset($week['isPresent']) || $week['isPresent'] === null) {
            continue;
        }

        if ($week['isPresent']) {
            $presentCount++;
        } else {
            $absentCount++;
        }
    }

    $markedCount = $presentCount + $absentCount;
    $presentRate = 0;
    $absentRate = 0;

    if ($markedCount > 0) {
        $presentRate = round(($presentCount / $markedCount) * 100, 1);
        $absentRate = round(($absentCount / $markedCount) * 100, 1);
    }

    return array(
        'presentCount' => $presentCount,
        'absentCount' => $absentCount,
        'markedCount' => $markedCount,
        'presentRate' => $presentRate,
        'absentRate' => $absentRate,
    );
}

function normalizeAttendanceStudent(array $student)
{
    $summary = summarizeAttendanceWeeks($student['weeks']);

    return array(
        'id' => (int) $student['id'],
        'email' => $student['email'],
        'firstName' => $student['firstName'],
        'lastName' => $student['lastName'],
        'studentNumber' => $student['studentNumber'],
        'enrolledAt' => $student['enrolledAt'],
        'weeks' => array_values($student['weeks']),
        'presentCount' => $summary['presentCount'],
        'absentCount' => $summary['absentCount'],
        'markedCount' => $summary['markedCount'],
        'presentRate' => $summary['presentRate'],
        'absentRate' => $summary['absentRate'],
    );
}

function fetchCourseAttendance($courseId)
{
    $pdo = getCoursesPdo();
    $viewer = requireAuthenticatedUser($pdo);

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $sql = '
        SELECT
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.student_number,
            e.created_at AS enrolled_at,
            a.week_number,
            a.is_present,
            a.updated_at
        FROM course_enrollments e
        INNER JOIN users u ON u.id = e.user_id
        LEFT JOIN course_attendance a ON a.course_id = e.course_id AND a.user_id = e.user_id
        WHERE e.course_id = :course_id
          AND u.role = \'STUDENT\'
          AND u.is_active = 1';

    $params = array(':course_id' => $courseId);

    if (strtoupper((string) $viewer['role']) === 'STUDENT') {
        $sql .= ' AND u.id = :viewer_id';
        $params[':viewer_id'] = $viewer['id'];
    }

    $sql .= ' ORDER BY u.first_name ASC, u.last_name ASC, u.student_number ASC, a.week_number ASC';

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    $students = array();

    while ($row = $statement->fetch()) {
        $studentId = (int) $row['id'];

        if (!isset($students[$studentId])) {
            $students[$studentId] = array(
                'id' => $studentId,
                'email' => $row['email'],
                'firstName' => $row['first_name'],
                'lastName' => $row['last_name'],
                'studentNumber' => $row['student_number'],
                'enrolledAt' => $row['enrolled_at'],
                'weeks' => buildAttendanceWeekItems(),
            );
        }

        if (!isset($row['week_number']) || $row['week_number'] === null) {
            continue;
        }

        $weekIndex = (int) $row['week_number'];

        if ($weekIndex < 1 || $weekIndex > COURSE_ATTENDANCE_WEEK_COUNT) {
            continue;
        }

        $isPresent = null;

        if ($row['is_present'] !== null) {
            $isPresent = (int) $row['is_present'] === 1;
        }

        $students[$studentId]['weeks'][$weekIndex - 1]['isPresent'] = $isPresent;
        $students[$studentId]['weeks'][$weekIndex - 1]['updatedAt'] = $row['updated_at'];
    }

    $attendanceRows = array();

    foreach ($students as $student) {
        $attendanceRows[] = normalizeAttendanceStudent($student);
    }

    return array(
        'success' => true,
        'message' => 'Course attendance loaded successfully.',
        'course' => $course,
        'weekCount' => COURSE_ATTENDANCE_WEEK_COUNT,
        'data' => $attendanceRows,
        'total' => count($attendanceRows),
    );
}

function updateCourseAttendance($courseId, $studentId, $weekNumber, $isPresent)
{
    $pdo = getCoursesPdo();
    $actor = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = trim($courseId);
    $studentId = (int) $studentId;
    $weekNumber = (int) $weekNumber;
    $isPresent = (bool) $isPresent;

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    if ($studentId <= 0) {
        throw new InvalidArgumentException('Student id is required.');
    }

    if ($weekNumber < 1 || $weekNumber > COURSE_ATTENDANCE_WEEK_COUNT) {
        throw new InvalidArgumentException('Week number must be between 1 and ' . COURSE_ATTENDANCE_WEEK_COUNT . '.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
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
          AND e.user_id = :student_id
          AND u.role = \'STUDENT\'
          AND u.is_active = 1
        LIMIT 1
    ');
    $statement->execute(array(
        ':course_id' => $courseId,
        ':student_id' => $studentId,
    ));

    $studentRow = $statement->fetch();

    if (!$studentRow) {
        throw new RuntimeException('Student is not enrolled in this course.');
    }

    $statement = $pdo->prepare('
        INSERT INTO course_attendance (course_id, user_id, week_number, is_present, marked_by)
        VALUES (:course_id, :user_id, :week_number, :is_present, :marked_by)
        ON DUPLICATE KEY UPDATE
            is_present = VALUES(is_present),
            marked_by = VALUES(marked_by),
            updated_at = CURRENT_TIMESTAMP
    ');
    $statement->execute(array(
        ':course_id' => $courseId,
        ':user_id' => $studentId,
        ':week_number' => $weekNumber,
        ':is_present' => $isPresent ? 1 : 0,
        ':marked_by' => $actor['id'],
    ));

    $attendanceStatement = $pdo->prepare('
        SELECT week_number, is_present, updated_at
        FROM course_attendance
        WHERE course_id = :course_id
          AND user_id = :user_id
        ORDER BY week_number ASC
    ');
    $attendanceStatement->execute(array(
        ':course_id' => $courseId,
        ':user_id' => $studentId,
    ));

    $weeks = buildAttendanceWeekItems();

    while ($attendanceRow = $attendanceStatement->fetch()) {
        $attendanceWeek = (int) $attendanceRow['week_number'];

        if ($attendanceWeek < 1 || $attendanceWeek > COURSE_ATTENDANCE_WEEK_COUNT) {
            continue;
        }

        $weeks[$attendanceWeek - 1]['isPresent'] = (int) $attendanceRow['is_present'] === 1;
        $weeks[$attendanceWeek - 1]['updatedAt'] = $attendanceRow['updated_at'];
    }

    $student = normalizeAttendanceStudent(array(
        'id' => $studentRow['id'],
        'email' => $studentRow['email'],
        'firstName' => $studentRow['first_name'],
        'lastName' => $studentRow['last_name'],
        'studentNumber' => $studentRow['student_number'],
        'enrolledAt' => $studentRow['enrolled_at'],
        'weeks' => $weeks,
    ));

    return array(
        'success' => true,
        'message' => 'Course attendance updated successfully.',
        'course' => $course,
        'student' => $student,
        'weekNumber' => $weekNumber,
    );
}

function fetchAvailableStudents($courseId, $search = '')
{
    $pdo = getCoursesPdo();
    requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = trim($courseId);
    $search = trim($search);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
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

    return array(
        'success' => true,
        'message' => 'Available students loaded successfully.',
        'course' => $course,
        'data' => $students,
        'total' => count($students),
    );
}

function enrollStudentsToCourse($courseId, array $studentIds)
{
    $pdo = getCoursesPdo();
    $actor = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = trim($courseId);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course id is required.');
    }

    $course = fetchCourseById($courseId);

    if (!$course) {
        throw new RuntimeException('Course not found.');
    }

    $cleanStudentIds = array();

    foreach ($studentIds as $studentId) {
        $studentId = (int) $studentId;

        if ($studentId > 0) {
            $cleanStudentIds[$studentId] = $studentId;
        }
    }

    $cleanStudentIds = array_values($cleanStudentIds);

    if (empty($cleanStudentIds)) {
        throw new InvalidArgumentException('At least one student must be selected.');
    }

    $placeholders = implode(',', array_fill(0, count($cleanStudentIds), '?'));

    $statement = $pdo->prepare('SELECT id, first_name, last_name, student_number FROM users WHERE id IN (' . $placeholders . ') AND role = \'STUDENT\' AND is_active = 1');
    $statement->execute($cleanStudentIds);

    $validStudents = array();

    while ($row = $statement->fetch()) {
        $validStudents[(int) $row['id']] = array(
            'id' => (int) $row['id'],
            'firstName' => $row['first_name'],
            'lastName' => $row['last_name'],
            'studentNumber' => $row['student_number'],
        );
    }

    if (empty($validStudents)) {
        throw new InvalidArgumentException('No valid students were selected.');
    }

    $placeholders = implode(',', array_fill(0, count($cleanStudentIds), '?'));
    $statement = $pdo->prepare('SELECT user_id FROM course_enrollments WHERE course_id = ? AND user_id IN (' . $placeholders . ')');
    $statement->execute(array_merge(array($courseId), $cleanStudentIds));

    $alreadyEnrolled = array();

    while ($row = $statement->fetch()) {
        $alreadyEnrolled[(int) $row['user_id']] = true;
    }

    $insertableStudentIds = array();

    foreach ($validStudents as $studentId => $student) {
        if (!isset($alreadyEnrolled[$studentId])) {
            $insertableStudentIds[] = $studentId;
        }
    }

    if (empty($insertableStudentIds)) {
        return array(
            'success' => true,
            'message' => 'Selected students are already enrolled.',
            'course' => $course,
            'data' => array(),
            'enrolledCount' => 0,
        );
    }

    $pdo->beginTransaction();

    try {
        $insertStatement = $pdo->prepare('INSERT INTO course_enrollments (course_id, user_id, enrolled_by) VALUES (:course_id, :user_id, :enrolled_by)');

        foreach ($insertableStudentIds as $studentId) {
            $insertStatement->execute(array(
                ':course_id' => $courseId,
                ':user_id' => $studentId,
                ':enrolled_by' => $actor['id'],
            ));
        }

        $pdo->commit();
    } catch (Exception $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $exception;
    }

    $enrolledStudents = array();

    foreach ($insertableStudentIds as $studentId) {
        $enrolledStudents[] = $validStudents[$studentId];
    }

    return array(
        'success' => true,
        'message' => 'Students enrolled successfully.',
        'course' => $course,
        'data' => $enrolledStudents,
        'enrolledCount' => count($enrolledStudents),
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

function unenrollStudentsFromCourse($courseId, array $studentIds)
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

    $cleanStudentIds = array();

    foreach ($studentIds as $studentId) {
        $studentId = (int) $studentId;

        if ($studentId > 0) {
            $cleanStudentIds[$studentId] = $studentId;
        }
    }

    $cleanStudentIds = array_values($cleanStudentIds);

    if (empty($cleanStudentIds)) {
        throw new InvalidArgumentException('At least one student must be selected.');
    }

    $placeholders = implode(',', array_fill(0, count($cleanStudentIds), '?'));

    $statement = $pdo->prepare('SELECT user_id FROM course_enrollments WHERE course_id = ? AND user_id IN (' . $placeholders . ')');
    $statement->execute(array_merge(array($courseId), $cleanStudentIds));

    $enrolledStudentIds = array();

    while ($row = $statement->fetch()) {
        $enrolledStudentIds[] = (int) $row['user_id'];
    }

    if (empty($enrolledStudentIds)) {
        return array(
            'success' => true,
            'message' => 'Selected students are not enrolled in this course.',
            'course' => $course,
            'data' => array(),
            'unenrolledCount' => 0,
        );
    }

    $deletePlaceholders = implode(',', array_fill(0, count($enrolledStudentIds), '?'));

    $pdo->beginTransaction();

    try {
        $params = array_merge(array($courseId), $enrolledStudentIds);

        $attendanceDelete = $pdo->prepare('DELETE FROM course_attendance WHERE course_id = ? AND user_id IN (' . $deletePlaceholders . ')');
        $attendanceDelete->execute($params);

        $gradeDelete = $pdo->prepare('DELETE FROM course_grade_scores WHERE course_id = ? AND user_id IN (' . $deletePlaceholders . ')');
        $gradeDelete->execute($params);

        $enrollmentDelete = $pdo->prepare('DELETE FROM course_enrollments WHERE course_id = ? AND user_id IN (' . $deletePlaceholders . ')');
        $enrollmentDelete->execute($params);

        $pdo->commit();
    } catch (Exception $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        throw $exception;
    }

    return array(
        'success' => true,
        'message' => 'Students removed from course successfully.',
        'course' => $course,
        'data' => $enrolledStudentIds,
        'unenrolledCount' => count($enrolledStudentIds),
    );
}