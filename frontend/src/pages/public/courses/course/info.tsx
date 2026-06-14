import { useMemo, type ElementType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpenText, GraduationCap, Languages, NotebookPen, Users2 } from "lucide-react";
import { CourseDetailedInfoEditModal } from "@/components/common/course-detailed-info-edit-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useCourseInfo } from "@/hooks/use-course-info";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useOutletContext } from "react-router";
import type { Course } from "@/types/course";

type DetailTableProps = {
    rows: Array<{
        label: string;
        value: ReactNode;
    }>;
};

function DetailTable({ rows }: DetailTableProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/95 shadow-sm">
            <div className="divide-y divide-border/60">
                {rows.map((row) => (
                    <div key={row.label} className="grid gap-3 px-5 py-4 md:grid-cols-[260px_1fr] md:items-start md:px-6">
                        <div className="text-sm font-semibold text-foreground md:pt-0.5">{row.label}</div>
                        <div className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">{row.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SectionCard({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: ElementType;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card className="rounded-3xl border-border/60 bg-card/95 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

const CourseInfoPage = () => {
    const { course } = useOutletContext<{ course: Course }>();
    const { lang } = useLanguage();
    const isTurkish = lang === 'tr';

    const copy = useMemo(() => {
        if (isTurkish) {
            return {
                pageTitle: 'Ders Bilgileri',
                pageDescription: 'Dersin temel tanımı, kredisi, amaçları ve kaynakları.',
                title: 'Ders Bilgileri',
                intro: 'Bu sayfa resmi ders bilgi kartını gösterir.',
                language: 'Dersin Dili',
                semester: 'Dönem',
                credits: 'Kredi',
                lectureHours: 'Ders (saat/hafta)',
                practiceHours: 'Uygulama (saat/hafta)',
                labHours: 'Laboratuvar (saat/hafta)',
                coordinator: 'Dersin Koordinatörü',
                objectives: 'Dersin Amaçları',
                description: 'Dersin Tanımı',
                outcomes: 'Ders Çıktıları',
                prerequisites: 'Ön Koşullar',
                other: 'Diğer Bilgiler',
                book: 'Ders Kitabı',
                references: 'Diğer Referanslar',
                empty: 'Bilgi eklenmemiş',
                noObjectives: 'Bu ders için amaç bilgisi eklenmemiş.',
                noDescription: 'Bu ders için tanım bilgisi eklenmemiş.',
                noOutcomes: 'Bu ders için çıktı bilgisi eklenmemiş.',
                noPrerequisites: 'Ön koşul bilgisi eklenmemiş.',
                noBook: 'Ders kitabı bilgisi eklenmemiş.',
                noReferences: 'Referans bilgisi eklenmemiş.',
            };
        }

        return {
            pageTitle: 'Course Information',
            pageDescription: 'Course definition, credits, objectives, and references.',
            title: 'Course Information',
            intro: 'This page shows the official course information card.',
            language: 'Course Language',
            semester: 'Semester',
            credits: 'Credits',
            lectureHours: 'Lecture (hours/week)',
            practiceHours: 'Practice (hours/week)',
            labHours: 'Lab (hours/week)',
            coordinator: 'Course Coordinator',
            objectives: 'Course Objectives',
            description: 'Course Description',
            outcomes: 'Course Outcomes',
            prerequisites: 'Prerequisites',
            other: 'Other Information',
            book: 'Textbook',
            references: 'Other References',
            empty: 'No information added',
            noObjectives: 'No objectives have been added for this course.',
            noDescription: 'No description has been added for this course.',
            noOutcomes: 'No outcomes have been added for this course.',
            noPrerequisites: 'No prerequisites have been added.',
            noBook: 'No textbook information has been added.',
            noReferences: 'No reference information has been added.',
        };
    }, [isTurkish]);

    useDocumentTitle(
        `${course?.code || ''} - ${copy.pageTitle}`,
        copy.pageDescription
    );

    const { user } = useAuth();
    const { courseInfo, isLoading } = useCourseInfo(course?.id);
    const detailedCourse = courseInfo || course;
    const info = detailedCourse?.info || null;

    const localizedText = (trValue: string | null | undefined, enValue: string | null | undefined, fallback: string) => {
        const primary = isTurkish ? trValue : enValue;
        const secondary = isTurkish ? enValue : trValue;

        return (primary && primary.trim()) || (secondary && secondary.trim()) || fallback;
    };

    const renderParagraph = (value: string | null | undefined, fallback: string) => {
        if (!value || !value.trim()) {
            return fallback;
        }

        return value;
    };

    if (isLoading && !detailedCourse) {
        return (
            <section className="space-y-4">
                <Skeleton className="min-h-30 rounded-3xl" />
                <Skeleton className="min-h-55 rounded-3xl" />
                <Skeleton className="min-h-55 rounded-3xl" />
            </section>
        );
    }

    const safeObjectives = info ? info.objectives : { tr: null, en: null };
    const safeDescription = info ? info.description : { tr: null, en: null };
    const safeOutcomes = info ? info.outcomes : { tr: null, en: null };
    const safePrerequisites = info ? info.prerequisites : { tr: null, en: null };
    const safeOtherNotes = info ? info.otherNotes : { tr: null, en: null };
    const safeTextbook = info ? info.textbook : { tr: null, en: null };
    const safeReferences = info ? info.references : { tr: null, en: null };

    const metricRows = [
        { label: copy.semester, value: info && info.semester !== null ? String(info.semester) : '—' },
        { label: copy.credits, value: info && info.credits !== null ? String(info.credits) : '—' },
        { label: copy.lectureHours, value: info && info.lectureHours !== null ? String(info.lectureHours) : '—' },
        { label: copy.practiceHours, value: info && info.practiceHours !== null ? String(info.practiceHours) : '—' },
        { label: copy.labHours, value: info && info.labHours !== null ? String(info.labHours) : '—' },
    ];

    const canEdit = user?.role === 'ADMIN';

    return (
        <section className="space-y-5">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                <Card className="overflow-hidden rounded-3xl border-border/60 bg-linear-to-br from-card via-card to-muted/50 shadow-sm">
                    <CardHeader className="border-b border-border/60 pb-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-start gap-3">
                            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-600">
                                <BookOpenText className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl">{copy.title}</CardTitle>
                                <CardDescription>{copy.intro}</CardDescription>
                            </div>
                            </div>
                            {canEdit ? <CourseDetailedInfoEditModal course={detailedCourse} /> : null}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {metricRows.map((metric) => (
                                <div key={metric.label} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{metric.label}</p>
                                    <p className="mt-2 text-base font-semibold text-foreground">{metric.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
                className="grid gap-5 lg:grid-cols-2"
            >
                <SectionCard
                    icon={Languages}
                    title={copy.language}
                    description={isTurkish ? 'Ders dili ve koordinatör.' : 'Course language and coordinator.'}
                >
                    <DetailTable
                        rows={[
                            { label: copy.language, value: localizedText(info?.language, info?.language, copy.empty) },
                            { label: copy.coordinator, value: info?.coordinator || copy.empty },
                        ]}
                    />
                </SectionCard>

                <SectionCard
                    icon={GraduationCap}
                    title={copy.objectives}
                    description={isTurkish ? 'Amaçlar, çıktılar ve ön koşullar.' : 'Objectives, outcomes, and prerequisites.'}
                >
                    <DetailTable
                        rows={[
                            { label: copy.objectives, value: renderParagraph(localizedText(safeObjectives.tr, safeObjectives.en, ''), copy.noObjectives) },
                            { label: copy.description, value: renderParagraph(localizedText(safeDescription.tr, safeDescription.en, ''), copy.noDescription) },
                            { label: copy.outcomes, value: renderParagraph(localizedText(safeOutcomes.tr, safeOutcomes.en, ''), copy.noOutcomes) },
                            { label: copy.prerequisites, value: renderParagraph(localizedText(safePrerequisites.tr, safePrerequisites.en, ''), copy.noPrerequisites) },
                        ]}
                    />
                </SectionCard>

                <SectionCard
                    icon={NotebookPen}
                    title={copy.other}
                    description={isTurkish ? 'Ek notlar, kitap ve referanslar.' : 'Additional notes, textbook, and references.'}
                >
                    <DetailTable
                        rows={[
                            { label: copy.other, value: renderParagraph(localizedText(safeOtherNotes.tr, safeOtherNotes.en, ''), copy.empty) },
                            { label: copy.book, value: renderParagraph(localizedText(safeTextbook.tr, safeTextbook.en, ''), copy.noBook) },
                            { label: copy.references, value: renderParagraph(localizedText(safeReferences.tr, safeReferences.en, ''), copy.noReferences) },
                        ]}
                    />
                </SectionCard>

                <SectionCard
                    icon={Users2}
                    title={isTurkish ? 'Ders Yükü' : 'Course Load'}
                    description={isTurkish ? 'Haftalık kredi ve saat dağılımı.' : 'Weekly credit and hour distribution.'}
                >
                    <DetailTable
                        rows={[
                            { label: isTurkish ? 'Dönem' : 'Semester', value: metricRows[0].value },
                            { label: copy.credits, value: metricRows[1].value },
                            { label: copy.lectureHours, value: metricRows[2].value },
                            { label: copy.practiceHours, value: metricRows[3].value },
                            { label: copy.labHours, value: metricRows[4].value },
                        ]}
                    />
                </SectionCard>
            </motion.div>
        </section>
    );
};

export default CourseInfoPage;