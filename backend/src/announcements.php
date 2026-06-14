<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/courses.php';

function normalizeAnnouncement(array $announcement)
{
    return array(
        'id' => $announcement['id'],
        'title' => array(
            'tr' => $announcement['title_tr'],
            'en' => $announcement['title_en'],
        ),
        'description' => array(
            'tr' => $announcement['description_tr'],
            'en' => $announcement['description_en'],
        ),
        'date' => substr($announcement['published_at'], 0, 10),
        'courseId' => $announcement['course_id'],
        'audience' => $announcement['audience'],
        'isNew' => isset($announcement['is_new']) ? ((int) $announcement['is_new'] === 1) : false,
        'createdBy' => isset($announcement['created_by']) && $announcement['created_by'] !== null ? (int) $announcement['created_by'] : null,
    );
}

function getAnnouncementsPdo()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    return createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
}

function buildAnnouncementFilters(array $filters)
{
    $where = array();
    $params = array();

    if (!empty($filters['audience'])) {
        $where[] = 'a.audience = :audience';
        $params[':audience'] = $filters['audience'];
    }

    if (!empty($filters['showOnlyNew'])) {
        $where[] = 'a.is_new = 1';
    }

    if (!empty($filters['courseIds']) && is_array($filters['courseIds'])) {
        $placeholders = array();

        foreach (array_values($filters['courseIds']) as $index => $courseId) {
            $placeholder = ':course_id_' . $index;
            $placeholders[] = $placeholder;
            $params[$placeholder] = $courseId;
        }

        if (!empty($placeholders)) {
            $where[] = 'a.course_id IN (' . implode(', ', $placeholders) . ')';
        }
    }

    if (!empty($filters['dateFilter']) && $filters['dateFilter'] !== 'all') {
        switch ($filters['dateFilter']) {
            case 'today':
                $where[] = 'DATE(a.published_at) = CURDATE()';
                break;
            case 'week':
                $where[] = 'DATE(a.published_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
                break;
            case 'month':
                $where[] = 'DATE(a.published_at) >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)';
                break;
        }
    }

    if (!empty($filters['search'])) {
        $where[] = '(a.title_tr LIKE :search OR a.title_en LIKE :search OR a.description_tr LIKE :search OR a.description_en LIKE :search OR c.code LIKE :search)';
        $params[':search'] = '%' . $filters['search'] . '%';
    }

    return array($where, $params);
}

function getAnnouncementCount($pdo, array $filters = array())
{
    list($where, $params) = buildAnnouncementFilters($filters);

    $sql = '
        SELECT COUNT(*) AS total
        FROM announcements a
        INNER JOIN courses c ON c.id = a.course_id';

    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $statement = $pdo->prepare($sql);
    $statement->execute($params);

    $row = $statement->fetch();

    return $row ? (int) $row['total'] : 0;
}

function fetchAnnouncements($filters)
{
    $pdo = getAnnouncementsPdo();

    $offset = isset($filters['offset']) ? (int) $filters['offset'] : 0;
    $limit = isset($filters['limit']) ? (int) $filters['limit'] : 10;
    $sortBy = isset($filters['sortBy']) ? $filters['sortBy'] : 'newest';

    list($where, $params) = buildAnnouncementFilters($filters);

    $orderBy = 'a.published_at DESC, a.id DESC';

    switch ($sortBy) {
        case 'oldest':
            $orderBy = 'a.published_at ASC, a.id ASC';
            break;
        case 'newest':
        default:
            $orderBy = 'a.published_at DESC, a.id DESC';
            break;
    }

    $sql = '
        SELECT
            a.id,
            a.course_id,
            a.title_tr,
            a.title_en,
            a.description_tr,
            a.description_en,
            a.audience,
            a.is_new,
            a.created_by,
            a.published_at,
            c.code AS course_code
        FROM announcements a
        INNER JOIN courses c ON c.id = a.course_id';

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

    $announcements = array();

    while ($row = $statement->fetch()) {
        $announcements[] = normalizeAnnouncement($row);
    }

    $total = getAnnouncementCount($pdo, $filters);

    return array(
        'data' => $announcements,
        'total' => $total,
        'offset' => $offset,
        'limit' => $limit,
        'hasMore' => $offset + $limit < $total,
    );
}

function fetchAnnouncementById($announcementId)
{
    $pdo = getAnnouncementsPdo();

    $statement = $pdo->prepare('
        SELECT
            a.id,
            a.course_id,
            a.title_tr,
            a.title_en,
            a.description_tr,
            a.description_en,
            a.audience,
            a.is_new,
            a.created_by,
            a.published_at
        FROM announcements a
        WHERE a.id = :announcement_id
        LIMIT 1
    ');
    $statement->execute(array(':announcement_id' => $announcementId));

    $row = $statement->fetch();

    return $row ? normalizeAnnouncement($row) : null;
}

function createAnnouncement()
{
    $pdo = getAnnouncementsPdo();
    $user = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));
    $body = readJsonRequestBody();

    $courseId = isset($body['courseId']) ? trim($body['courseId']) : '';
    $titleTr = isset($body['titleTr']) ? trim($body['titleTr']) : '';
    $titleEn = isset($body['titleEn']) ? trim($body['titleEn']) : '';
    $descriptionTr = isset($body['descriptionTr']) ? trim($body['descriptionTr']) : '';
    $descriptionEn = isset($body['descriptionEn']) ? trim($body['descriptionEn']) : '';
    $audience = isset($body['audience']) ? trim($body['audience']) : '';
    $isNew = !empty($body['isNew']) ? 1 : 0;

    if ($courseId === '' || $titleTr === '' || $titleEn === '' || $descriptionTr === '' || $descriptionEn === '' || $audience === '') {
        throw new InvalidArgumentException('Announcement fields are required.');
    }

    if (!in_array($audience, array('common', 'department'), true)) {
        throw new InvalidArgumentException('Invalid announcement audience.');
    }

    if (!fetchCourseById($courseId)) {
        throw new RuntimeException('Course not found.');
    }

    $announcementId = 'ann-' . preg_replace('/[^a-zA-Z0-9]+/', '', uniqid('', true));

    $statement = $pdo->prepare('
        INSERT INTO announcements (id, course_id, title_tr, title_en, description_tr, description_en, audience, is_new, created_by)
        VALUES (:id, :course_id, :title_tr, :title_en, :description_tr, :description_en, :audience, :is_new, :created_by)
    ');

    $statement->execute(array(
        ':id' => $announcementId,
        ':course_id' => $courseId,
        ':title_tr' => $titleTr,
        ':title_en' => $titleEn,
        ':description_tr' => $descriptionTr,
        ':description_en' => $descriptionEn,
        ':audience' => $audience,
        ':is_new' => $isNew,
        ':created_by' => $user['id'],
    ));

    $announcement = fetchAnnouncementById($announcementId);

    return array(
        'success' => true,
        'message' => 'Announcement created successfully.',
        'announcement' => $announcement,
    );
}

function deleteAnnouncement($announcementId)
{
    $pdo = getAnnouncementsPdo();
    $user = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $announcementId = trim($announcementId);

    if ($announcementId === '') {
        throw new InvalidArgumentException('Announcement id is required.');
    }

    $announcement = fetchAnnouncementById($announcementId);

    if (!$announcement) {
        throw new RuntimeException('Announcement not found.');
    }

    if ($user['role'] !== 'ADMIN' && (int) $announcement['createdBy'] !== (int) $user['id']) {
        throw new RuntimeException('Forbidden.');
    }

    $statement = $pdo->prepare('DELETE FROM announcements WHERE id = :announcement_id');
    $statement->execute(array(':announcement_id' => $announcementId));

    return array(
        'success' => true,
        'message' => 'Announcement deleted successfully.',
        'announcement' => $announcement,
    );
}