<?php

require_once __DIR__ . '/../config/db.php';

function readJsonRequestBody()
{
    $rawInput = file_get_contents('php://input');

    if ($rawInput === false || trim($rawInput) === '') {
        return $_POST;
    }

    $decoded = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        return $_POST;
    }

    return $decoded;
}

function normalizeAuthenticatedUser(array $user)
{
    $normalizedUser = array(
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name'],
        'role' => $user['role'],
        'isActive' => (bool) $user['is_active'],
        'createdAt' => $user['created_at'],
    );

    if ($user['role'] === 'STUDENT') {
        $normalizedUser['studentNumber'] = isset($user['student_number']) ? $user['student_number'] : null;
    }

    return $normalizedUser;
}

function normalizeSession(array $session)
{
    return array(
        'token' => $session['token'],
        'expiresAt' => $session['expiresAt'],
    );
}

function getAuthorizationHeaderValue()
{
    if (function_exists('getallheaders')) {
        $headers = getallheaders();

        foreach ($headers as $name => $value) {
            if (strcasecmp($name, 'Authorization') === 0) {
                return $value;
            }
        }
    }

    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }

    return '';
}

function getBearerToken()
{
    $authorizationHeader = trim(getAuthorizationHeaderValue());

    if ($authorizationHeader === '') {
        return '';
    }

    if (stripos($authorizationHeader, 'Bearer ') !== 0) {
        return '';
    }

    return trim(substr($authorizationHeader, 7));
}

function hashAuthToken($token)
{
    return hash('sha256', $token);
}

function sessionExpiresAtTimestamp($expiresAt)
{
    $dateTime = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $expiresAt, new DateTimeZone('UTC'));

    if ($dateTime === false) {
        return 0;
    }

    return $dateTime->getTimestamp();
}

function createSessionToken($pdo, $userId)
{
    $rawToken = bin2hex(function_exists('random_bytes') ? random_bytes(32) : openssl_random_pseudo_bytes(32));
    $tokenHash = hashAuthToken($rawToken);
    $expiresAt = gmdate('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60));

    $statement = $pdo->prepare('INSERT INTO auth_sessions (user_id, token_hash, expires_at) VALUES (:user_id, :token_hash, :expires_at)');
    $statement->execute(array(
        ':user_id' => $userId,
        ':token_hash' => $tokenHash,
        ':expires_at' => $expiresAt,
    ));

    return array(
        'token' => $rawToken,
        'expiresAt' => $expiresAt,
    );
}

function fetchAuthenticatedUserByToken($pdo, $token)
{
    if ($token === '') {
        return null;
    }

    $tokenHash = hashAuthToken($token);

    $statement = $pdo->prepare(
        'SELECT 
            u.id,
            u.email,
            u.first_name,
            u.last_name,
            u.role,
            u.student_number,
            u.is_active,
            u.created_at,
            s.expires_at,
            s.revoked_at
        FROM auth_sessions s
        INNER JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = :token_hash
        LIMIT 1'
    );
    $statement->execute(array(':token_hash' => $tokenHash));

    $row = $statement->fetch();

    if (!$row) {
        return null;
    }

    if (!empty($row['revoked_at'])) {
        return null;
    }

    if (sessionExpiresAtTimestamp($row['expires_at']) < time()) {
        return null;
    }

    if ((int) $row['is_active'] !== 1) {
        return null;
    }

    $touchStatement = $pdo->prepare('UPDATE auth_sessions SET last_used_at = CURRENT_TIMESTAMP WHERE token_hash = :token_hash');
    $touchStatement->execute(array(':token_hash' => $tokenHash));

    return normalizeAuthenticatedUser($row);
}

function revokeSessionToken($pdo, $token)
{
    if ($token === '') {
        return false;
    }

    $statement = $pdo->prepare('UPDATE auth_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE token_hash = :token_hash AND revoked_at IS NULL');
    $statement->execute(array(':token_hash' => hashAuthToken($token)));

    return $statement->rowCount() > 0;
}

function requireAuthenticatedUser($pdo, $allowedRoles = array())
{
    $user = fetchAuthenticatedUserByToken($pdo, getBearerToken());

    if (!$user) {
        throw new RuntimeException('Unauthorized.');
    }

    if (!empty($allowedRoles) && !in_array($user['role'], $allowedRoles, true)) {
        throw new RuntimeException('Forbidden.');
    }

    return $user;
}

function loginUser()
{
    $body = readJsonRequestBody();
    $email = isset($body['email']) ? trim($body['email']) : '';
    $password = isset($body['password']) ? (string) $body['password'] : '';

    if ($email === '' || $password === '') {
        throw new InvalidArgumentException('Email and password are required.');
    }

    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);

    $statement = $pdo->prepare('SELECT id, email, password_hash, first_name, last_name, role, student_number, is_active, created_at FROM users WHERE email = :email LIMIT 1');
    $statement->execute(array(':email' => $email));

    $user = $statement->fetch();

    if (!$user || !isset($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
        throw new RuntimeException('Invalid email or password.');
    }

    if ((int) $user['is_active'] !== 1) {
        throw new RuntimeException('Account is inactive.');
    }

    $session = createSessionToken($pdo, $user['id']);
    unset($user['password_hash']);

    return array(
        'success' => true,
        'message' => 'Login successful.',
        'user' => normalizeAuthenticatedUser($user),
        'session' => normalizeSession($session),
    );
}

function getAuthenticatedUser()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);

    $user = requireAuthenticatedUser($pdo);

    return array(
        'success' => true,
        'message' => 'Authenticated user loaded.',
        'user' => $user,
    );
}

function logoutUser()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');
    $dbUser = env('DB_USER', 'bitirme_user');
    $dbPass = env('DB_PASS', 'bitirme_pass');

    $pdo = createDatabasePdo($dbHost, $dbPort, $dbName, $dbUser, $dbPass, true);
    $token = getBearerToken();

    if ($token === '') {
        throw new InvalidArgumentException('Authorization token is required.');
    }

    revokeSessionToken($pdo, $token);

    return array(
        'success' => true,
        'message' => 'Logout successful.',
    );
}