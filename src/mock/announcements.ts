interface MockAnnouncement {
    id: string;
    titleKey: string;
    date: string;
    courseId: string;
    isNew: boolean;
}

const MockAnnouncements: MockAnnouncement[] = [
    { id: "a1", titleKey: "announcements.titles.midterm", date: "2026-01-17", courseId: "mat103e", isNew: true },
    { id: "a2", titleKey: "announcements.titles.officeHours", date: "2026-01-16", courseId: "mat471e", isNew: true },
    { id: "a3", titleKey: "announcements.titles.projectDeadline", date: "2026-01-15", courseId: "mat491e", isNew: true },
    { id: "a4", titleKey: "announcements.titles.newMaterials", date: "2026-01-14", courseId: "mat104e", isNew: false },
    { id: "a5", titleKey: "announcements.titles.labSession", date: "2026-01-13", courseId: "fiz101e", isNew: false },
    { id: "a6", titleKey: "announcements.titles.examResults", date: "2026-01-12", courseId: "mat345e", isNew: false },
    { id: "a7", titleKey: "announcements.titles.lectureCancel", date: "2026-01-11", courseId: "mat251e", isNew: false },
    { id: "a8", titleKey: "announcements.titles.makeupExam", date: "2026-01-10", courseId: "mat361e", isNew: false },
    { id: "a9", titleKey: "announcements.titles.homeworkSubmission", date: "2026-01-09", courseId: "mat252e", isNew: false },
    { id: "a10", titleKey: "announcements.titles.guestLecture", date: "2026-01-08", courseId: "mat382e", isNew: false },
    { id: "a11", titleKey: "announcements.titles.libraryAccess", date: "2026-01-07", courseId: "hum111e", isNew: false },
    { id: "a12", titleKey: "announcements.titles.studyGroup", date: "2026-01-06", courseId: "mat362e", isNew: false },
];

export { MockAnnouncements };
export type { MockAnnouncement };