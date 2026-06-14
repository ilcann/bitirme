SET NAMES utf8mb4;

INSERT IGNORE INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role,
    student_number,
    is_active
) VALUES
('admin@bitirme.local', '$2y$10$zL.MZkjGqHo4DRHUCy/oou9/T1J0zhH8IwT.xYpTY2g9IcmBtTmGa', 'Recep', 'İlcan', 'ADMIN', NULL, TRUE),
('instructor@bitirme.local', '$2y$10$zL.MZkjGqHo4DRHUCy/oou9/T1J0zhH8IwT.xYpTY2g9IcmBtTmGa', 'Deneme', 'Eğitmen', 'INSTRUCTOR', NULL, TRUE),
('student@bitirme.local', '$2y$10$zL.MZkjGqHo4DRHUCy/oou9/T1J0zhH8IwT.xYpTY2g9IcmBtTmGa', 'Deneme', 'Öğrenci', 'STUDENT', '20240000', TRUE);
