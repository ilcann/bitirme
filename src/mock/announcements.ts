interface MockAnnouncement {
    id: string;
    title: {
        tr: string;
        en: string;
    };
    date: string;
    courseId: string;
    isNew: boolean;
}

const MockAnnouncements: MockAnnouncement[] = [
    { id: "a1", title: { tr: "Vize sınavı programı yayınlandı", en: "Midterm exam schedule published" }, date: "2026-01-17", courseId: "mat103e", isNew: true },
    { id: "a2", title: { tr: "Ofis saatleri güncellendi", en: "Office hours updated" }, date: "2026-01-16", courseId: "mat471e", isNew: true },
    { id: "a3", title: { tr: "Proje teslim tarihi yakınıyor", en: "Project deadline approaching" }, date: "2026-01-15", courseId: "mat491e", isNew: true },
    { id: "a4", title: { tr: "Yeni ders materyalleri eklendi", en: "New course materials added" }, date: "2026-01-14", courseId: "mat104e", isNew: false },
    { id: "a5", title: { tr: "Laboratuvar oturumu duyurusu", en: "Laboratory session announcement" }, date: "2026-01-13", courseId: "fiz101e", isNew: false },
    { id: "a6", title: { tr: "Sınav sonuçları açıklandı", en: "Exam results published" }, date: "2026-01-12", courseId: "mat345e", isNew: false },
    { id: "a7", title: { tr: "Ders iptal edildi", en: "Lecture cancelled" }, date: "2026-01-11", courseId: "mat251e", isNew: false },
    { id: "a8", title: { tr: "Mazeret sınavı duyurusu", en: "Makeup exam announcement" }, date: "2026-01-10", courseId: "mat361e", isNew: false },
    { id: "a9", title: { tr: "Ödev teslim hatırlatması", en: "Homework submission reminder" }, date: "2026-01-09", courseId: "mat252e", isNew: false },
    { id: "a10", title: { tr: "Konuk konuşmacı semineri", en: "Guest speaker seminar" }, date: "2026-01-08", courseId: "mat382e", isNew: false },
    { id: "a11", title: { tr: "Kütüphane erişim bilgileri", en: "Library access information" }, date: "2026-01-07", courseId: "hum111e", isNew: false },
    { id: "a12", title: { tr: "Çalışma grubu duyurusu", en: "Study group announcement" }, date: "2026-01-06", courseId: "mat362e", isNew: false },
];

export { MockAnnouncements };
export type { MockAnnouncement };