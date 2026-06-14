CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    last_used_at TIMESTAMP NULL DEFAULT NULL,
    revoked_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_auth_sessions_user_id (user_id),
    INDEX idx_auth_sessions_expires_at (expires_at),
    CONSTRAINT fk_auth_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('student@bitirme.local', '$2y$10$CWBJovvvcW1UumQ2GjIkKuS5esaxJWbCYwKDSsVJ1QMpUMG9X3p8C', 'Deneme', 'Ogrenci', 'STUDENT', TRUE),
('instructor@bitirme.local', '$2y$10$oWlH3FfgH0WsxDRL8UDzZOLuMk2z15ezw79cM1U1ybaCmSzt9Ydry', 'Deneme', 'Egitmen', 'INSTRUCTOR', TRUE);