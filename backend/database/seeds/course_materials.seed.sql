SET NAMES utf8mb4;

INSERT INTO course_materials (
    id,
    course_id,
    title_tr,
    title_en,
    description_tr,
    description_en,
    material_type,
    file_name,
    original_file_name,
    file_path,
    external_url,
    file_size,
    mime_type,
    created_by
) VALUES
(1, 'mat103e', 'Hafta 1 Ders Notları', 'Week 1 Lecture Notes', 'Limit ve süreklilik için temel notlar.', 'Basic notes for limits and continuity.', 'lecture', 'mat103e_week1.pdf', 'mat103e_week1.pdf', '/storage/materials/mat103e_week1.pdf', NULL, 1843200, 'application/pdf', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
(2, 'mat104e', 'Alıştırma Seti 2', 'Exercise Set 2', 'Türev ve integral uygulamaları.', 'Applications of differentiation and integration.', 'assignment', 'mat104e_hw2.pdf', 'mat104e_hw2.pdf', '/storage/materials/mat104e_hw2.pdf', NULL, 952000, 'application/pdf', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
(3, 'mat252e', 'Çözüm Videosu', 'Solution Video', 'Matris işlemleri için örnek çözüm videosu.', 'Sample solution video for matrix operations.', 'video', NULL, NULL, NULL, 'https://example.com/mat252e-video', NULL, 'text/html', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1)),
(4, 'mat491e', 'Proje Yönergesi', 'Project Guideline', 'Bitirme projesi teslim kuralları.', 'Graduation project submission rules.', 'document', 'mat491e_guideline.pdf', 'mat491e_guideline.pdf', '/storage/materials/mat491e_guideline.pdf', NULL, 612000, 'application/pdf', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1))
ON DUPLICATE KEY UPDATE
    course_id = VALUES(course_id),
    title_tr = VALUES(title_tr),
    title_en = VALUES(title_en),
    description_tr = VALUES(description_tr),
    description_en = VALUES(description_en),
    material_type = VALUES(material_type),
    file_name = VALUES(file_name),
    original_file_name = VALUES(original_file_name),
    file_path = VALUES(file_path),
    external_url = VALUES(external_url),
    file_size = VALUES(file_size),
    mime_type = VALUES(mime_type),
    created_by = VALUES(created_by);
