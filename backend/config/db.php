<?php

require_once __DIR__ . '/env.php';

function connectDatabase($host, $port, $name, $user, $pass, $useDatabase)
{
    $dsn = 'mysql:host=' . $host . ';port=' . $port . ';charset=utf8';

    if ($useDatabase) {
        $dsn .= ';dbname=' . $name;
    }

    $pdo = new PDO(
        $dsn,
        $user,
        $pass,
        array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        )
    );

    $statement = $pdo->query('SELECT DATABASE() AS database_name, VERSION() AS server_version');

    return $statement->fetch();
}

function testDatabaseConnection()
{
    $dbHost = env('DB_HOST', 'db');
    $dbName = env('DB_NAME', 'bitirme_db');
    $dbPort = env('DB_PORT', '3306');

    $credentials = array(
        array(
            'user' => env('DB_USER', 'bitirme_user'),
            'pass' => env('DB_PASS', 'bitirme_pass'),
        ),
        array(
            'user' => env('DB_ROOT_USER', 'root'),
            'pass' => env('DB_ROOT_PASS', 'root_password'),
        ),
    );

    foreach ($credentials as $credential) {
        foreach (array(true, false) as $databaseMode) {
            try {
                $result = connectDatabase($dbHost, $dbPort, $dbName, $credential['user'], $credential['pass'], $databaseMode);

                return array(
                    'success' => true,
                    'message' => 'Database connection successful.',
                    'database' => $result['database_name'],
                    'serverVersion' => $result['server_version'],
                    'connectedAs' => $credential['user'],
                    'selectedDatabase' => $databaseMode,
                );
            } catch (Exception $exception) {
                continue;
            }
        }
    }

    throw new Exception('Unable to connect with the configured MySQL credentials.');
}