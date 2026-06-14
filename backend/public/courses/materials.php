<?php

require_once __DIR__ . '/../../src/materials.php';

header('Content-Type: application/json; charset=utf-8');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $courseId = isset($_GET['courseId']) ? trim($_GET['courseId']) : '';
        $offset = isset($_GET['offset']) ? (int) $_GET['offset'] : 0;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $search = isset($_GET['search']) ? trim($_GET['search']) : null;
        $sortBy = isset($_GET['sortBy']) ? trim($_GET['sortBy']) : 'newest';
        $types = array();

        if (isset($_GET['types']) && trim($_GET['types']) !== '') {
            $types = array_map('trim', explode(',', trim($_GET['types'])));
        }

        echo json_encode(fetchCourseMaterials($courseId, $offset, $limit, $search, $types, $sortBy), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        echo json_encode(createMaterial(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        echo json_encode(deleteMaterial(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
    $statusCode = $exception->getMessage() === 'Forbidden.' ? 403 : 401;

    if ($exception->getMessage() === 'Material not found.') {
        $statusCode = 404;
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
        'message' => 'Failed to process materials request.',
        'error' => $exception->getMessage(),
    ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}