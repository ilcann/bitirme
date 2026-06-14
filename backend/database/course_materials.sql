SET NAMES utf8mb4;

CREATE TABLE course_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_tr TEXT NULL,
    description_en TEXT NULL,
    material_type ENUM('lecture', 'assignment', 'exam', 'document', 'video', 'link') NOT NULL DEFAULT 'document',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;