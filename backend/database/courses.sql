SET NAMES utf8mb4;

CREATE TABLE courses (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    color VARCHAR(32) NOT NULL,
    audience ENUM('common', 'department') NOT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE course_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    enrolled_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_course_user (course_id, user_id),
    INDEX idx_course_enrollments_course_id (course_id),
    INDEX idx_course_enrollments_user_id (user_id),
    CONSTRAINT fk_course_enrollments_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_enrollments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_enrollments_enrolled_by FOREIGN KEY (enrolled_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE course_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    week_number TINYINT UNSIGNED NOT NULL,
    is_present TINYINT(1) NULL DEFAULT NULL,
    marked_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_course_user_week (course_id, user_id, week_number),
    INDEX idx_course_attendance_course_id (course_id),
    INDEX idx_course_attendance_user_id (user_id),
    INDEX idx_course_attendance_week_number (week_number),
    CONSTRAINT fk_course_attendance_course_id FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_attendance_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_course_attendance_marked_by FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

INSERT INTO courses (id, code, title_tr, title_en, color, audience) VALUES
('mat103e', 'MAT 103/E', 'Matematik I', 'Mathematics I', 'chart-1', 'common'),
('mat104e', 'MAT 104/E', 'Matematik II', 'Mathematics II', 'chart-1', 'common'),
('mat345e', 'MAT 345/E', 'Olasılık ve İstatistik', 'Probability and Statistics', 'chart-3', 'department'),
('mat471e', 'MAT 471/E', 'Sayısal Analiz', 'Numerical Analysis', 'chart-4', 'department'),
('mate', 'MATE', 'Mühendislik Matematiği', 'Engineering Mathematics', 'chart-5', 'department'),
('mat251e', 'MAT 251/E', 'Diferansiyel Denklemler', 'Differential Equations', 'chart-2', 'department'),
('mat252e', 'MAT 252/E', 'Lineer Cebir', 'Linear Algebra', 'chart-2', 'department'),
('mat361e', 'MAT 361/E', 'Kompleks Fonksiyonlar Teorisi', 'Complex Functions Theory', 'chart-3', 'department'),
('mat362e', 'MAT 362/E', 'Reel Analiz', 'Real Analysis', 'chart-3', 'department'),
('mat381e', 'MAT 381/E', 'Soyut Matematik I', 'Abstract Mathematics I', 'chart-3', 'department'),
('mat382e', 'MAT 382/E', 'Soyut Matematik II', 'Abstract Mathematics II', 'chart-3', 'department'),
('mat491e', 'MAT 491/E', 'Bitirme Projesi I', 'Graduation Project I', 'chart-4', 'department'),
('mat492e', 'MAT 492/E', 'Bitirme Projesi II', 'Graduation Project II', 'chart-4', 'department');