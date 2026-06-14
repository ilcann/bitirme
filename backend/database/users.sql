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

INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('student@bitirme.local', '$2y$10$CWBJovvvcW1UumQ2GjIkKuS5esaxJWbCYwKDSsVJ1QMpUMG9X3p8C', 'Deneme', 'Ogrenci', 'STUDENT', TRUE),
('instructor@bitirme.local', '$2y$10$oWlH3FfgH0WsxDRL8UDzZOLuMk2z15ezw79cM1U1ybaCmSzt9Ydry', 'Deneme', 'Egitmen', 'INSTRUCTOR', TRUE);