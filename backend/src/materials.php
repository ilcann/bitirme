<?php

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/courses.php';

function getMaterialTypes()
{
    return array('lecture', 'assignment', 'exam', 'document', 'video', 'link');
}

function isValidMaterialType($type)
{
    return in_array($type, getMaterialTypes(), true);
}

function formatMaterialSize($sizeInBytes)
{
    if ($sizeInBytes === null) {
        return null;
    }

    $size = (float) $sizeInBytes;

    if ($size <= 0) {
        return null;
    }

    $units = array('B', 'KB', 'MB', 'GB');
    $unitIndex = 0;

    while ($size >= 1024 && $unitIndex < count($units) - 1) {
        $size /= 1024;
        $unitIndex++;
    }

    $formattedSize = number_format($size, $unitIndex === 0 ? 0 : 1, '.', '');
    $formattedSize = rtrim(rtrim($formattedSize, '0'), '.');

    return $formattedSize . ' ' . $units[$unitIndex];
}

function deriveMaterialTitleFromFileName($fileName)
{
    $baseName = pathinfo($fileName, PATHINFO_FILENAME);
    $baseName = preg_replace('/[_-]+/', ' ', $baseName);
    $baseName = preg_replace('/\s+/', ' ', $baseName);
    $baseName = trim($baseName);

    return $baseName !== '' ? $baseName : 'Material';
}

function buildStoredMaterialFileName($directoryPath, $originalFileName)
{
    $extension = pathinfo($originalFileName, PATHINFO_EXTENSION);
    $baseName = pathinfo($originalFileName, PATHINFO_FILENAME);
    $safeBaseName = preg_replace('/[^\pL\pN._-]+/u', '_', $baseName);
    $safeBaseName = trim($safeBaseName, '._-');

    if ($safeBaseName === '') {
        $safeBaseName = 'material';
    }

    $safeExtension = preg_replace('/[^A-Za-z0-9]+/', '', $extension);
    $candidate = $safeBaseName . ($safeExtension !== '' ? '.' . $safeExtension : '');
    $counter = 1;

    while (file_exists($directoryPath . '/' . $candidate)) {
        $candidate = $safeBaseName . '_' . $counter . ($safeExtension !== '' ? '.' . $safeExtension : '');
        $counter++;
    }

    return $candidate;
}

function courseMaterialsColumnExists($pdo, $columnName)
{
    $statement = $pdo->prepare("SHOW COLUMNS FROM course_materials LIKE :column_name");
    $statement->execute(array(':column_name' => $columnName));

    return (bool) $statement->fetch();
}

function courseMaterialsIndexExists($pdo, $indexName)
{
    $statement = $pdo->prepare("SHOW INDEX FROM course_materials WHERE Key_name = :index_name");
    $statement->execute(array(':index_name' => $indexName));

    return (bool) $statement->fetch();
}

function courseMaterialsConstraintExists($pdo, $constraintName)
{
    $statement = $pdo->prepare('
        SELECT CONSTRAINT_NAME
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = :table_name
          AND CONSTRAINT_NAME = :constraint_name
        LIMIT 1
    ');
    $statement->execute(array(
        ':table_name' => 'course_materials',
        ':constraint_name' => $constraintName,
    ));

    return (bool) $statement->fetch();
}

function ensureMaterialsSchema($pdo)
{
    $pdo->exec('
        CREATE TABLE IF NOT EXISTS course_materials (
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id VARCHAR(50) NOT NULL,
            title_tr VARCHAR(255) NOT NULL,
            title_en VARCHAR(255) NOT NULL,
            description_tr TEXT NULL,
            description_en TEXT NULL,
            material_type ENUM(\'lecture\', \'assignment\', \'exam\', \'document\', \'video\', \'link\') NOT NULL DEFAULT \'document\',
            file_name VARCHAR(255) DEFAULT NULL,
            original_file_name VARCHAR(255) DEFAULT NULL,
            file_path VARCHAR(500) DEFAULT NULL,
            external_url VARCHAR(500) DEFAULT NULL,
            file_size BIGINT UNSIGNED DEFAULT NULL,
            mime_type VARCHAR(100) DEFAULT NULL,
            created_by INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_course_materials_course_id (course_id),
            INDEX idx_course_materials_type (material_type),
            INDEX idx_course_materials_created_by (created_by),
            CONSTRAINT fk_course_materials_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            CONSTRAINT fk_course_materials_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci
    ');

    if (courseMaterialsConstraintExists($pdo, 'fk_course_materials_uploaded_by')) {
        $pdo->exec('ALTER TABLE course_materials DROP FOREIGN KEY fk_course_materials_uploaded_by');
    }

    if (courseMaterialsColumnExists($pdo, 'type') && !courseMaterialsColumnExists($pdo, 'material_type')) {
        $pdo->exec("ALTER TABLE course_materials CHANGE COLUMN type material_type ENUM('lecture', 'assignment', 'exam', 'document', 'video', 'link') NOT NULL DEFAULT 'document'");
    }

    if (courseMaterialsColumnExists($pdo, 'uploaded_by') && !courseMaterialsColumnExists($pdo, 'created_by')) {
        $pdo->exec('ALTER TABLE course_materials CHANGE COLUMN uploaded_by created_by INT NOT NULL');
    }

    if (!courseMaterialsColumnExists($pdo, 'file_name')) {
        $pdo->exec('ALTER TABLE course_materials ADD COLUMN file_name VARCHAR(255) DEFAULT NULL AFTER material_type');
    }

    if (!courseMaterialsColumnExists($pdo, 'original_file_name')) {
        $pdo->exec('ALTER TABLE course_materials ADD COLUMN original_file_name VARCHAR(255) DEFAULT NULL AFTER file_name');
    }

    if (!courseMaterialsColumnExists($pdo, 'external_url')) {
        $pdo->exec('ALTER TABLE course_materials ADD COLUMN external_url VARCHAR(500) DEFAULT NULL AFTER file_path');
    }

    if (!courseMaterialsColumnExists($pdo, 'mime_type')) {
        $pdo->exec('ALTER TABLE course_materials ADD COLUMN mime_type VARCHAR(100) DEFAULT NULL AFTER file_size');
    }

    $pdo->exec('ALTER TABLE course_materials MODIFY COLUMN file_path VARCHAR(500) DEFAULT NULL');
    $pdo->exec('ALTER TABLE course_materials MODIFY COLUMN file_size BIGINT UNSIGNED DEFAULT NULL');
    if (courseMaterialsIndexExists($pdo, 'idx_course_materials_uploaded_by')) {
        $pdo->exec('ALTER TABLE course_materials DROP INDEX idx_course_materials_uploaded_by');
    }

    if (!courseMaterialsIndexExists($pdo, 'idx_course_materials_type')) {
        $pdo->exec('ALTER TABLE course_materials ADD INDEX idx_course_materials_type (material_type)');
    }

    if (!courseMaterialsIndexExists($pdo, 'idx_course_materials_created_by')) {
        $pdo->exec('ALTER TABLE course_materials ADD INDEX idx_course_materials_created_by (created_by)');
    }

    if (!courseMaterialsConstraintExists($pdo, 'fk_course_materials_created_by')) {
        $pdo->exec('ALTER TABLE course_materials ADD CONSTRAINT fk_course_materials_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE');
    }
}

function fetchMaterialRowById($pdo, $courseId, $materialId)
{
    $statement = $pdo->prepare('
        SELECT id, course_id, title_tr, title_en, description_tr, description_en, material_type, file_name, original_file_name, file_path, external_url, file_size, mime_type, created_by, created_at
        FROM course_materials
        WHERE course_id = :course_id AND id = :id
        LIMIT 1
    ');
    $statement->execute(array(
        ':course_id' => $courseId,
        ':id' => $materialId,
    ));

    $row = $statement->fetch();

    return $row ? $row : null;
}

function normalizeMaterial(array $row)
{
    $material = array(
        'id' => (int) $row['id'],
        'courseId' => $row['course_id'],
        'title' => array(
            'tr' => $row['title_tr'],
            'en' => $row['title_en'],
        ),
        'type' => $row['material_type'],
        'date' => $row['created_at'],
        'size' => isset($row['file_size']) && $row['file_size'] !== null ? formatMaterialSize($row['file_size']) : null,
        'url' => !empty($row['file_path']) ? $row['file_path'] : $row['external_url'],
        'createdBy' => (int) $row['created_by'],
    );

    if (!empty($row['description_tr']) || !empty($row['description_en'])) {
        $material['description'] = array(
            'tr' => $row['description_tr'],
            'en' => $row['description_en'],
        );
    }

    if (!empty($row['file_name'])) {
        $material['fileName'] = $row['file_name'];
    }

    if (!empty($row['original_file_name'])) {
        $material['originalFileName'] = $row['original_file_name'];
    }

    if (!empty($row['mime_type'])) {
        $material['mimeType'] = $row['mime_type'];
    }

    if (!empty($row['external_url'])) {
        $material['externalUrl'] = $row['external_url'];
    }

    return $material;
}

function fetchCourseMaterials($courseId, $offset = 0, $limit = 10, $search = null, $types = array(), $sortBy = 'newest')
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
    ensureMaterialsSchema($pdo);

    if ($courseId === '') {
        throw new InvalidArgumentException('Course not found.');
    }

    if (!fetchCourseById($courseId)) {
        throw new InvalidArgumentException('Course not found.');
    }

    $where = array('course_id = :course_id');
    $params = array(':course_id' => $courseId);

    if (!empty($types)) {
        $placeholders = array();

        foreach ($types as $index => $type) {
            if (!isValidMaterialType($type)) {
                continue;
            }

            $placeholder = ':type_' . $index;
            $placeholders[] = $placeholder;
            $params[$placeholder] = $type;
        }

        if (!empty($placeholders)) {
            $where[] = 'material_type IN (' . implode(', ', $placeholders) . ')';
        }
    }

    if ($search !== null && trim($search) !== '') {
        $where[] = '(title_tr LIKE :search OR title_en LIKE :search OR description_tr LIKE :search OR description_en LIKE :search)';
        $params[':search'] = '%' . trim($search) . '%';
    }

    $orderBy = 'created_at DESC';

    if ($sortBy === 'oldest') {
        $orderBy = 'created_at ASC';
    } elseif ($sortBy === 'title') {
        $orderBy = 'title_en ASC, title_tr ASC';
    }

    $countStatement = $pdo->prepare('SELECT COUNT(*) FROM course_materials WHERE ' . implode(' AND ', $where));
    $countStatement->execute($params);
    $total = (int) $countStatement->fetchColumn();

    $offset = max(0, (int) $offset);
    $limit = max(1, min(100, (int) $limit));

    $dataStatement = $pdo->prepare('
        SELECT id, course_id, title_tr, title_en, description_tr, description_en, material_type, file_name, original_file_name, file_path, external_url, file_size, mime_type, created_by, created_at
        FROM course_materials
        WHERE ' . implode(' AND ', $where) . '
        ORDER BY ' . $orderBy . '
        LIMIT ' . $offset . ', ' . $limit . '
    ');
    $dataStatement->execute($params);

    $materials = array();

    while ($row = $dataStatement->fetch()) {
        $materials[] = normalizeMaterial($row);
    }

    return array(
        'success' => true,
        'message' => 'Materials loaded successfully.',
        'data' => array(
            'data' => $materials,
            'total' => $total,
            'offset' => $offset,
            'limit' => $limit,
            'hasMore' => ($offset + $limit) < $total,
        ),
    );
}

function createMaterial()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
    ensureMaterialsSchema($pdo);

    $user = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));

    $courseId = isset($_POST['courseId']) ? trim($_POST['courseId']) : '';
    $titleTr = isset($_POST['titleTr']) ? trim($_POST['titleTr']) : '';
    $titleEn = isset($_POST['titleEn']) ? trim($_POST['titleEn']) : '';
    $descriptionTr = isset($_POST['descriptionTr']) ? trim($_POST['descriptionTr']) : '';
    $descriptionEn = isset($_POST['descriptionEn']) ? trim($_POST['descriptionEn']) : '';
    $type = isset($_POST['type']) ? trim($_POST['type']) : 'document';
    $externalUrl = isset($_POST['externalUrl']) ? trim($_POST['externalUrl']) : '';

    if ($courseId === '') {
        throw new InvalidArgumentException('Course and titles are required.');
    }

    if (!isValidMaterialType($type)) {
        throw new InvalidArgumentException('Invalid material type.');
    }

    if (!fetchCourseById($courseId)) {
        throw new InvalidArgumentException('Course not found.');
    }

    $fileName = null;
    $originalFileName = null;
    $filePath = null;
    $fileSize = null;
    $mimeType = null;

    if (isset($_FILES['file']) && isset($_FILES['file']['error']) && (int) $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $originalFileName = isset($_FILES['file']['name']) ? basename($_FILES['file']['name']) : 'material';
        $fileSize = isset($_FILES['file']['size']) ? (int) $_FILES['file']['size'] : null;
        $mimeType = isset($_FILES['file']['type']) ? trim($_FILES['file']['type']) : null;

        $storageDirectory = __DIR__ . '/../storage/materials';

        if (!is_dir($storageDirectory)) {
            mkdir($storageDirectory, 0775, true);
        }

        if ($titleTr === '') {
            $titleTr = deriveMaterialTitleFromFileName($originalFileName);
        }

        if ($titleEn === '') {
            $titleEn = deriveMaterialTitleFromFileName($originalFileName);
        }

        $fileName = buildStoredMaterialFileName($storageDirectory, $originalFileName);

        $destinationPath = $storageDirectory . '/' . $fileName;

        if (!move_uploaded_file($_FILES['file']['tmp_name'], $destinationPath)) {
            throw new RuntimeException('Failed to save uploaded file.');
        }

        $filePath = '/ilcan21/api/storage/materials/' . $fileName;
    } elseif ($externalUrl !== '') {
        if (!filter_var($externalUrl, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('External URL is invalid.');
        }

        $filePath = $externalUrl;
    } else {
        throw new InvalidArgumentException('A file or external URL is required.');
    }

    if ($courseId === '' || $titleTr === '' || $titleEn === '') {
        throw new InvalidArgumentException('Course and titles are required.');
    }

    $insertStatement = $pdo->prepare('
        INSERT INTO course_materials (
            course_id,
            title_tr,
            title_en,
            description_tr,
            description_en,
            material_type,
            file_name,
            original_file_name,
            file_path,
            external_url,
            file_size,
            mime_type,
            created_by
        ) VALUES (
            :course_id,
            :title_tr,
            :title_en,
            :description_tr,
            :description_en,
            :material_type,
            :file_name,
            :original_file_name,
            :file_path,
            :external_url,
            :file_size,
            :mime_type,
            :created_by
        )
    ');
    $insertStatement->execute(array(
        ':course_id' => $courseId,
        ':title_tr' => $titleTr,
        ':title_en' => $titleEn,
        ':description_tr' => $descriptionTr !== '' ? $descriptionTr : null,
        ':description_en' => $descriptionEn !== '' ? $descriptionEn : null,
        ':material_type' => $type,
        ':file_name' => $fileName,
        ':original_file_name' => $originalFileName,
        ':file_path' => $filePath,
        ':external_url' => $type === 'link' ? $externalUrl : null,
        ':file_size' => $fileSize,
        ':mime_type' => $mimeType,
        ':created_by' => $user['id'],
    ));

    $material = fetchMaterialRowById($pdo, $courseId, (int) $pdo->lastInsertId());

    return array(
        'success' => true,
        'message' => 'Material created successfully.',
        'material' => normalizeMaterial($material),
    );
}

function deleteMaterial()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
    ensureMaterialsSchema($pdo);

    $user = requireAuthenticatedUser($pdo, array('ADMIN', 'INSTRUCTOR'));
    $courseId = isset($_GET['courseId']) ? trim($_GET['courseId']) : '';
    $materialId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($courseId === '' || $materialId <= 0) {
        throw new InvalidArgumentException('Course and material identifiers are required.');
    }

    $material = fetchMaterialRowById($pdo, $courseId, $materialId);

    if (!$material) {
        throw new InvalidArgumentException('Material not found.');
    }

    if ($user['role'] !== 'ADMIN' && (int) $material['created_by'] !== (int) $user['id']) {
        throw new RuntimeException('Forbidden.');
    }

    $deleteStatement = $pdo->prepare('DELETE FROM course_materials WHERE id = :id AND course_id = :course_id');
    $deleteStatement->execute(array(
        ':id' => $materialId,
        ':course_id' => $courseId,
    ));

    if (!empty($material['file_name'])) {
        $localFilePath = __DIR__ . '/../storage/materials/' . $material['file_name'];

        if (file_exists($localFilePath)) {
            @unlink($localFilePath);
        }
    }

    return array(
        'success' => true,
        'message' => 'Material deleted successfully.',
        'materialId' => $materialId,
    );
}