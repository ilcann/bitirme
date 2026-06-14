SET NAMES utf8mb4;

INSERT INTO courses (
    id,
    code,
    title_tr,
    title_en,
    color,
    audience,
    created_by
) VALUES
('mat103e', 'MAT 103/E', 'Matematik I', 'Mathematics I', 'chart-1', 'common', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat104e', 'MAT 104/E', 'Matematik II', 'Mathematics II', 'chart-1', 'common', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat251e', 'MAT 251/E', 'Diferansiyel Denklemler', 'Differential Equations', 'chart-2', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat252e', 'MAT 252/E', 'Lineer Cebir', 'Linear Algebra', 'chart-2', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat345e', 'MAT 345/E', 'Olasılık ve İstatistik', 'Probability and Statistics', 'chart-3', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat361e', 'MAT 361/E', 'Kompleks Fonksiyonlar Teorisi', 'Complex Functions Theory', 'chart-3', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat362e', 'MAT 362/E', 'Reel Analiz', 'Real Analysis', 'chart-3', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat381e', 'MAT 381/E', 'Soyut Matematik I', 'Abstract Mathematics I', 'chart-3', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat382e', 'MAT 382/E', 'Soyut Matematik II', 'Abstract Mathematics II', 'chart-3', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat471e', 'MAT 471/E', 'Sayısal Analiz', 'Numerical Analysis', 'chart-4', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat491e', 'MAT 491/E', 'Bitirme Projesi I', 'Graduation Project I', 'chart-4', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mat492e', 'MAT 492/E', 'Bitirme Projesi II', 'Graduation Project II', 'chart-4', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
('mate', 'MATE', 'Mühendislik Matematiği', 'Engineering Mathematics', 'chart-5', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1))
ON DUPLICATE KEY UPDATE
    code = VALUES(code),
    title_tr = VALUES(title_tr),
    title_en = VALUES(title_en),
    color = VALUES(color),
    audience = VALUES(audience),
    created_by = VALUES(created_by);

UPDATE courses
SET
    language = 'Türkçe/English',
    credits = COALESCE(credits, 4),
    lecture_hours = COALESCE(lecture_hours, 3),
    practice_hours = COALESCE(practice_hours, 1),
    semester = COALESCE(semester, 1),
    section_name = COALESCE(section_name, 'A'),
    term_tr = COALESCE(term_tr, '2025-2026 Güz'),
    term_en = COALESCE(term_en, 'Fall 2025-2026'),
    start_date = COALESCE(start_date, '2026-01-06'),
    end_date = COALESCE(end_date, '2026-06-12'),
    instructors = COALESCE(instructors, 'Deneme Eğitmen'),
    assistants = COALESCE(assistants, 'Asistan 1, Asistan 2'),
    schedule_tr = COALESCE(schedule_tr, 'Salı 10:00-12:00'),
    schedule_en = COALESCE(schedule_en, 'Tuesday 10:00-12:00'),
    summary_tr = COALESCE(summary_tr, CONCAT(title_tr, ' dersi için örnek özet metni.')),
    summary_en = COALESCE(summary_en, CONCAT(title_en, ' sample course summary.')),
    objectives_tr = COALESCE(objectives_tr, 'Konu temellerini öğretmek.'),
    objectives_en = COALESCE(objectives_en, 'To teach the fundamentals.'),
    description_tr = COALESCE(description_tr, 'Bu ders örnek bir açıklama içeriğine sahiptir.'),
    description_en = COALESCE(description_en, 'This course contains sample descriptive content.'),
    outcomes_tr = COALESCE(outcomes_tr, 'Öğrenciler temel kavramları uygular.'),
    outcomes_en = COALESCE(outcomes_en, 'Students apply the core concepts.'),
    prerequisites_tr = COALESCE(prerequisites_tr, 'Ön koşul bilgisi yoktur.'),
    prerequisites_en = COALESCE(prerequisites_en, 'No prerequisite information.'),
    other_notes_tr = COALESCE(other_notes_tr, 'Ders içeriği dönem boyunca güncellenebilir.'),
    other_notes_en = COALESCE(other_notes_en, 'The course content may be updated during the term.'),
    textbook_tr = COALESCE(textbook_tr, 'Önerilen ders notları ve ilgili kaynaklar.'),
    textbook_en = COALESCE(textbook_en, 'Suggested lecture notes and related sources.'),
    references_tr = COALESCE(references_tr, 'İlgili akademik kaynaklar.'),
    references_en = COALESCE(references_en, 'Related academic references.')
WHERE id IN ('mat103e', 'mat104e', 'mat251e', 'mat252e', 'mat345e', 'mat361e', 'mat362e', 'mat381e', 'mat382e', 'mat471e', 'mat491e', 'mat492e', 'mate');

INSERT INTO course_grade_distributions (
    course_id,
    midterm_count,
    final_count,
    project_count,
    homework_count,
    quiz_count,
    midterm_weight,
    final_weight,
    project_weight,
    homework_weight,
    quiz_weight,
    updated_by
)
SELECT
    c.id,
    2,
    1,
    2,
    14,
    14,
    40,
    30,
    10,
    10,
    10,
    (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)
FROM courses c
ON DUPLICATE KEY UPDATE
    midterm_count = VALUES(midterm_count),
    final_count = VALUES(final_count),
    project_count = VALUES(project_count),
    homework_count = VALUES(homework_count),
    quiz_count = VALUES(quiz_count),
    midterm_weight = VALUES(midterm_weight),
    final_weight = VALUES(final_weight),
    project_weight = VALUES(project_weight),
    homework_weight = VALUES(homework_weight),
    quiz_weight = VALUES(quiz_weight),
    updated_by = VALUES(updated_by);
