<?php

require_once __DIR__ . '/../../src/announcements.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if (isset($_GET['announcementId']) && trim($_GET['announcementId']) !== '') {
        $announcement = fetchAnnouncementById(trim($_GET['announcementId']));

        if (!$announcement) {
            http_response_code(404);

            echo json_encode(array(
                'success' => false,
                'message' => 'Announcement not found.',
            ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            return;
        }

        echo json_encode(array(
            'success' => true,
            'message' => 'Announcement loaded successfully.',
            'announcement' => $announcement,
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
    $audience = isset($_GET['audience']) ? trim($_GET['audience']) : null;
    $search = isset($_GET['search']) ? trim($_GET['search']) : null;
    $courseIds = isset($_GET['courseIds']) && trim($_GET['courseIds']) !== '' ? explode(',', trim($_GET['courseIds'])) : null;
    $showOnlyNew = isset($_GET['showOnlyNew']) && $_GET['showOnlyNew'] === '1';
    $dateFilter = isset($_GET['dateFilter']) ? trim($_GET['dateFilter']) : 'all';
    $sortBy = isset($_GET['sortBy']) ? trim($_GET['sortBy']) : 'newest';

    echo json_encode(array(
        'success' => true,
        'message' => 'Announcements loaded successfully.',
        'data' => fetchAnnouncements(array(
            'audience' => $audience,
            'offset' => $offset,
            'limit' => $limit,
            'search' => $search,
            'courseIds' => $courseIds,
            'showOnlyNew' => $showOnlyNew,
            'dateFilter' => $dateFilter,
            'sortBy' => $sortBy,
        )),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Exception $exception) {
    http_response_code(500);

    echo json_encode(array(
        'success' => false,
        'message' => 'Failed to load announcements.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}