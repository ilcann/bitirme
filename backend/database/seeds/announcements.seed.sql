SET NAMES utf8mb4;

INSERT INTO announcements (
    id,
    course_id,
    title_tr,
    title_en,
    description_tr,
    description_en,
    audience,
    created_by,
    published_at
) VALUES
('ann-001', 'mat103e', 'Vize sınavı programı yayınlandı', 'Midterm exam schedule published', 'Vize sınavı 25 Ocak Cumartesi günü saat 10:00''da Amfi A''da yapılacaktır. Lütfen öğrenci kimliğinizi yanınızda bulundurmayı unutmayın.', 'The midterm exam will be held on Saturday, January 25th at 10:00 AM in Amphitheater A. Please remember to bring your student ID.', 'common', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-17 09:00:00'),
('ann-002', 'mat471e', 'Ofis saatleri güncellendi', 'Office hours updated', 'Bu hafta ofis saatleri Salı ve Perşembe günleri saat 14:00-16:00 arasında olacaktır. Zoom bağlantısı için e-posta atınız.', 'Office hours this week will be on Tuesday and Thursday from 2:00 PM to 4:00 PM. Email for the Zoom link.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-16 11:00:00'),
('ann-003', 'mat491e', 'Proje teslim tarihi yakınıyor', 'Project deadline approaching', 'Bitirme projesi ara raporu 30 Ocak Perşembe günü saat 23:59''a kadar sistem üzerinden teslim edilmelidir. Geç teslimler kabul edilmeyecektir.', 'Graduation project interim report must be submitted through the system by Thursday, January 30th at 11:59 PM. Late submissions will not be accepted.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-15 12:00:00'),
('ann-004', 'mat104e', 'Yeni ders materyalleri eklendi', 'New course materials added', '5. ve 6. hafta ders notları, örnek problemler ve çözümleri sisteme yüklenmiştir. İyi çalışmalar.', 'Week 5 and 6 lecture notes, sample problems and solutions have been uploaded to the system. Good luck with your studies.', 'common', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-14 10:30:00'),
('ann-005', 'mat345e', 'Sınav sonuçları açıklandı', 'Exam results published', 'Quiz 2 sonuçları açıklanmıştır. Öğrenci bilgi sistemi üzerinden kontrol edebilirsiniz. İtirazlar için 3 gün içinde başvurunuz.', 'Quiz 2 results have been published. You can check them through the student information system. Submit appeals within 3 days.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-12 08:45:00'),
('ann-006', 'mat251e', 'Ders iptal edildi', 'Lecture cancelled', '20 Ocak Pazartesi günü yapılması planlanan ders, hoca rahatsızlığı nedeniyle iptal edilmiştir. Telafi dersi tarihi daha sonra duyurulacaktır.', 'The lecture scheduled for Monday, January 20th has been cancelled due to instructor illness. The makeup lecture date will be announced later.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-11 13:15:00'),
('ann-007', 'mat361e', 'Mazeret sınavı duyurusu', 'Makeup exam announcement', 'Vize sınavına mazeretli olarak katılamayanlar için mazeret sınavı 5 Şubat Çarşamba günü yapılacaktır. Başvurular en geç 1 Şubat''a kadar yapılmalıdır.', 'Makeup exam for those who missed the midterm with valid excuse will be held on Wednesday, February 5th. Applications must be made by February 1st at the latest.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-10 10:00:00'),
('ann-008', 'mat252e', 'Ödev teslim hatırlatması', 'Homework submission reminder', '3. ödev teslim tarihi 22 Ocak Çarşamba günü saat 23:59''dur. Ödevlerinizi PDF formatında sisteme yükleyiniz.', 'Homework 3 submission deadline is Wednesday, January 22nd at 11:59 PM. Please upload your homework in PDF format to the system.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-09 16:20:00'),
('ann-009', 'mat382e', 'Konuk konuşmacı semineri', 'Guest speaker seminar', 'Prof. Dr. Ayşe Yılmaz ''Modern Cebirde Yeni Yaklaşımlar'' konulu seminer verecektir. 28 Ocak Salı, saat 15:00, Amfi B. Tüm öğrenciler davetlidir.', 'Prof. Dr. Ayşe Yılmaz will give a seminar on "New Approaches in Modern Algebra". Tuesday, January 28th, 3:00 PM, Amphitheater B. All students are invited.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-08 14:00:00'),
('ann-010', 'mat104e', 'Kütüphane erişim bilgileri', 'Library access information', 'Dönem sonu nedeniyle kütüphane çalışma saatleri uzatılmıştır. Hafta içi 08:00-24:00, hafta sonu 10:00-22:00 arası açık olacaktır.', 'Due to the end of semester, library working hours have been extended. Open weekdays 8:00 AM-12:00 AM, weekends 10:00 AM-10:00 PM.', 'common', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-07 09:30:00'),
('ann-011', 'mat362e', 'Çalışma grubu duyurusu', 'Study group announcement', 'Final sınavına hazırlık için çalışma grubu oluşturulmuştur. Katılmak isteyenler Whatsapp grubuna davet linki ile katılabilir.', 'A study group has been formed for final exam preparation. Those who want to join can use the WhatsApp group invitation link.', 'department', (SELECT id FROM users WHERE email = 'instructor@bitirme.local' LIMIT 1), '2026-01-06 17:00:00')
ON DUPLICATE KEY UPDATE
    course_id = VALUES(course_id),
    title_tr = VALUES(title_tr),
    title_en = VALUES(title_en),
    description_tr = VALUES(description_tr),
    description_en = VALUES(description_en),
    audience = VALUES(audience),
    created_by = VALUES(created_by),
    published_at = VALUES(published_at);
