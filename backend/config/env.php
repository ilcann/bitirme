<?php

function loadEnvFile($filePath)
{
    if (!file_exists($filePath)) {
        return;
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $trimmedLine = trim($line);

        if ($trimmedLine === '' || $trimmedLine[0] === '#' || strpos($trimmedLine, '=') === false) {
            continue;
        }

        list($name, $value) = explode('=', $trimmedLine, 2);
        $name = trim($name);
        $value = trim($value);

        if ($value !== '') {
            $firstCharacter = substr($value, 0, 1);
            $lastCharacter = substr($value, -1);

            if (($firstCharacter === '"' && $lastCharacter === '"') || ($firstCharacter === "'" && $lastCharacter === "'")) {
                $value = substr($value, 1, -1);
            }
        }

        if (getenv($name) === false) {
            putenv($name . '=' . $value);
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}

function env($key, $defaultValue = null)
{
    $value = getenv($key);

    if ($value !== false) {
        return $value;
    }

    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }

    if (isset($_SERVER[$key])) {
        return $_SERVER[$key];
    }

    return $defaultValue;
}

loadEnvFile(__DIR__ . '/../.env');