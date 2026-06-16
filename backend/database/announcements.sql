SET NAMES utf8mb4;

CREATE TABLE announcements (
    id VARCHAR(80) PRIMARY KEY,
    course_id VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT NOT NULL,
    description_en TEXT NOT NULL,
    audience ENUM('common', 'department') NOT NULL,
    created_by INT NULL,
    published_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_announcements_course_id (course_id),
    INDEX idx_announcements_created_by (created_by),
    INDEX idx_announcements_audience (audience),
    INDEX idx_announcements_published_at (published_at),
    CONSTRAINT fk_announcements_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_announcements_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;