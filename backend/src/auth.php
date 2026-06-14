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
    return array(
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name'],
        'role' => $user['role'],
        'isActive' => (bool) $user['is_active'],
        'createdAt' => $user['created_at'],
    );
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

    $statement = $pdo->prepare('SELECT id, email, password_hash, first_name, last_name, role, is_active, created_at FROM users WHERE email = :email LIMIT 1');
    $statement->execute(array(':email' => $email));

    $user = $statement->fetch();

    if (!$user || !isset($user['password_hash']) || !password_verify($password, $user['password_hash'])) {
        throw new RuntimeException('Invalid email or password.');
    }

    if ((int) $user['is_active'] !== 1) {
        throw new RuntimeException('Account is inactive.');
    }

    unset($user['password_hash']);

    return array(
        'success' => true,
        'message' => 'Login successful.',
        'user' => normalizeAuthenticatedUser($user),
    );
}