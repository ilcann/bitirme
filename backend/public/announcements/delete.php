<?php

require_once __DIR__ . '/../../src/announcements.php';

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

    $body = readJsonRequestBody();
    $announcementId = isset($body['id']) ? trim($body['id']) : '';

    echo json_encode(deleteAnnouncement($announcementId), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
        'message' => 'Failed to delete announcement.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}