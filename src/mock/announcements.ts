interface MockAnnouncement {
    id: string;
    title: {
        tr: string;
        en: string;
    };
    description: {
        tr: string;
        en: string;
    };
    date: string;
    courseId: string;
    audience: 'common' | 'department';
    isNew: boolean;
}

const MockAnnouncements: MockAnnouncement[] = [
    { 
        id: "a1", 
        title: { tr: "Vize sınavı programı yayınlandı", en: "Midterm exam schedule published" },
        description: { tr: "Vize sınavı 25 Ocak Cumartesi günü saat 10:00'da Amfi A'da yapılacaktır. Lütfen öğrenci kimliğinizi yanınızda bulundurmayı unutmayın.", en: "The midterm exam will be held on Saturday, January 25th at 10:00 AM in Amphitheater A. Please remember to bring your student ID." },
        date: "2026-01-17", 
        courseId: "mat103e",
        audience: "common",
        isNew: true 
    },
    { 
        id: "a2", 
        title: { tr: "Ofis saatleri güncellendi", en: "Office hours updated" },
        description: { tr: "Bu hafta ofis saatleri Salı ve Perşembe günleri saat 14:00-16:00 arasında olacaktır. Zoom bağlantısı için e-posta atınız.", en: "Office hours this week will be on Tuesday and Thursday from 2:00 PM to 4:00 PM. Email for the Zoom link." },
        date: "2026-01-16", 
        courseId: "mat471e",
        audience: "department",
        isNew: true 
    },
    { 
        id: "a3", 
        title: { tr: "Proje teslim tarihi yakınıyor", en: "Project deadline approaching" },
        description: { tr: "Bitirme projesi ara raporu 30 Ocak Perşembe günü saat 23:59'a kadar sistem üzerinden teslim edilmelidir. Geç teslimler kabul edilmeyecektir.", en: "Graduation project interim report must be submitted through the system by Thursday, January 30th at 11:59 PM. Late submissions will not be accepted." },
        date: "2026-01-15", 
        courseId: "mat491e",
        audience: "department",
        isNew: true 
    },
    { 
        id: "a4", 
        title: { tr: "Yeni ders materyalleri eklendi", en: "New course materials added" },
        description: { tr: "5. ve 6. hafta ders notları, örnek problemler ve çözümleri sisteme yüklenmiştir. İyi çalışmalar.", en: "Week 5 and 6 lecture notes, sample problems and solutions have been uploaded to the system. Good luck with your studies." },
        date: "2026-01-14", 
        courseId: "mat104e",
        audience: "common",
        isNew: false 
    },
    { 
        id: "a6", 
        title: { tr: "Sınav sonuçları açıklandı", en: "Exam results published" },
        description: { tr: "Quiz 2 sonuçları açıklanmıştır. Öğrenci bilgi sistemi üzerinden kontrol edebilirsiniz. İtirazlar için 3 gün içinde başvurunuz.", en: "Quiz 2 results have been published. You can check them through the student information system. Submit appeals within 3 days." },
        date: "2026-01-12", 
        courseId: "mat345e",
        audience: "department",
        isNew: false 
    },
    { 
        id: "a7", 
        title: { tr: "Ders iptal edildi", en: "Lecture cancelled" },
        description: { tr: "20 Ocak Pazartesi günü yapılması planlanan ders, hoca rahatsızlığı nedeniyle iptal edilmiştir. Telafi dersi tarihi daha sonra duyurulacaktır.", en: "The lecture scheduled for Monday, January 20th has been cancelled due to instructor illness. The makeup lecture date will be announced later." },
        date: "2026-01-11", 
        courseId: "mat251e",
        audience: "department",
        isNew: false 
    },
    { 
        id: "a8", 
        title: { tr: "Mazeret sınavı duyurusu", en: "Makeup exam announcement" },
        description: { tr: "Vize sınavına mazeretli olarak katılamayanlar için mazeret sınavı 5 Şubat Çarşamba günü yapılacaktır. Başvurular en geç 1 Şubat'a kadar yapılmalıdır.", en: "Makeup exam for those who missed the midterm with valid excuse will be held on Wednesday, February 5th. Applications must be made by February 1st at the latest." },
        date: "2026-01-10", 
        courseId: "mat361e",
        audience: "department",
        isNew: false 
    },
    { 
        id: "a9", 
        title: { tr: "Ödev teslim hatırlatması", en: "Homework submission reminder" },
        description: { tr: "3. ödev teslim tarihi 22 Ocak Çarşamba günü saat 23:59'dur. Ödevlerinizi PDF formatında sisteme yükleyiniz.", en: "Homework 3 submission deadline is Wednesday, January 22nd at 11:59 PM. Please upload your homework in PDF format to the system." },
        date: "2026-01-09", 
        courseId: "mat252e",
        audience: "department",
        isNew: false 
    },
    { 
        id: "a10", 
        title: { tr: "Konuk konuşmacı semineri", en: "Guest speaker seminar" },
        description: { tr: "Prof. Dr. Ayşe Yılmaz 'Modern Cebirde Yeni Yaklaşımlar' konulu seminer verecektir. 28 Ocak Salı, saat 15:00, Amfi B. Tüm öğrenciler davetlidir.", en: "Prof. Dr. Ayşe Yılmaz will give a seminar on 'New Approaches in Modern Algebra'. Tuesday, January 28th, 3:00 PM, Amphitheater B. All students are invited." },
        date: "2026-01-08", 
        courseId: "mat382e",
        audience: "department",
        isNew: false 
    },
    { 
        id: "a11", 
        title: { tr: "Kütüphane erişim bilgileri", en: "Library access information" },
        description: { tr: "Dönem sonu nedeniyle kütüphane çalışma saatleri uzatılmıştır. Hafta içi 08:00-24:00, hafta sonu 10:00-22:00 arası açık olacaktır.", en: "Due to the end of semester, library working hours have been extended. Open weekdays 8:00 AM-12:00 AM, weekends 10:00 AM-10:00 PM." },
        date: "2026-01-07", 
        courseId: "mat104e",
        audience: "common",
        isNew: false 
    },
    { 
        id: "a12", 
        title: { tr: "Çalışma grubu duyurusu", en: "Study group announcement" },
        description: { tr: "Final sınavına hazırlık için çalışma grubu oluşturulmuştur. Katılmak isteyenler Whatsapp grubuna davet linki ile katılabilir.", en: "A study group has been formed for final exam preparation. Those who want to join can use the WhatsApp group invitation link." },
        date: "2026-01-06", 
        courseId: "mat362e",
        audience: "department",
        isNew: false 
    },
];

export { MockAnnouncements };
export type { MockAnnouncement };