import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, FileText, MapPin, Users2 } from "lucide-react";
import { CourseInfoEditModal } from "@/components/common/course-info-edit-modal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useCourseInfo } from "@/hooks/use-course-info";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useOutletContext } from "react-router";
import type { Course } from "@/types/course";

const CourseInfoPage = () => {
    const { course } = useOutletContext<{ course: Course }>();
    const { lang } = useLanguage();
    const { user } = useAuth();
    const isTurkish = lang === 'tr';
    const canEdit = user?.role === 'ADMIN';
    const copy = useMemo(() => {
        if (isTurkish) {
            return {
                pageTitle: 'Ders Ozeti',
                pageDescription: 'Dersin takvimini, ekibini ve haftalik akisini goruntuleyin.',
                summaryTitle: 'Dersin Ozeti',
                summaryFallback: 'Bu ders icin henuz bir ozet eklenmemis.',
                generalTitle: 'Genel Bilgiler',
                generalDescription: 'Temel tanim ve sinif kimligi bilgileri.',
                academicTitle: 'Akademik Takvim',
                academicDescription: 'Donem ve erisim tarihleri.',
                teamTitle: 'Egitim Ekibi',
                teamDescription: 'Dersi yuruten ekip bilgileri.',
                scheduleTitle: 'Haftalik Plan',
                scheduleDescription: 'Dersin yer ve zaman bilgisi.',
                code: 'Ders Kodu',
                section: 'Sinif',
                crn: 'CRN',
                term: 'Donem',
                startDate: 'Baslangic',
                endDate: 'Bitis',
                lastAccessDate: 'Son Erisim',
                instructors: 'Egitmenler',
                assistants: 'Yardimcilar',
                noAssistants: 'Tanimli yardimci yok',
                noSchedule: 'Yer ve zaman bilgisi eklenmemis',
                noTeam: 'Bu alan icin bilgi eklenmemis',
            };
        }

        return {
            pageTitle: 'Course Summary',
            pageDescription: 'Review the course calendar, teaching team, and weekly flow.',
            summaryTitle: 'Course Summary',
            summaryFallback: 'No summary has been added for this course yet.',
            generalTitle: 'General Details',
            generalDescription: 'Core identity and section information.',
            academicTitle: 'Academic Calendar',
            academicDescription: 'Term and access timeline.',
            teamTitle: 'Teaching Team',
            teamDescription: 'Instructors and assistants assigned to the course.',
            scheduleTitle: 'Weekly Plan',
            scheduleDescription: 'Time and location details for the class.',
            code: 'Course Code',
            section: 'Section',
            crn: 'CRN',
            term: 'Term',
            startDate: 'Start Date',
            endDate: 'End Date',
            lastAccessDate: 'Last Access',
            instructors: 'Instructors',
            assistants: 'Assistants',
            noAssistants: 'No assistants assigned',
            noSchedule: 'Schedule information has not been added',
            noTeam: 'No staff information has been added',
        };
    }, [isTurkish]);

    useDocumentTitle(
        `${course?.code || ''} - ${copy.pageTitle}`,
        copy.pageDescription
    );

    const { courseInfo, isLoading, isFetching } = useCourseInfo(course?.id);
    const detailedCourse = courseInfo || course;
    const info = detailedCourse?.info || null;
    const localizedSummary = isTurkish
        ? ((info && info.summary.tr) || (info && info.summary.en) || '')
        : ((info && info.summary.en) || (info && info.summary.tr) || '');
    const localizedTerm = isTurkish
        ? ((info && info.term.tr) || (info && info.term.en) || null)
        : ((info && info.term.en) || (info && info.term.tr) || null);
    const localizedSchedule = isTurkish
        ? ((info && info.schedule.tr.length > 0) ? info.schedule.tr : (info ? info.schedule.en : []))
        : ((info && info.schedule.en.length > 0) ? info.schedule.en : (info ? info.schedule.tr : []));

    const formatDate = (value: string | null | undefined) => {
        if (!value) {
            return '—';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(isTurkish ? 'tr-TR' : 'en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const InfoRow = ({ label, value }: { label: string; value: string }) => (
        <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3 last:border-b-0 last:pb-0 first:pt-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="max-w-[60%] text-right text-sm font-semibold text-foreground">{value}</span>
        </div>
    );

    const ListBlock = ({
        title,
        items,
        emptyLabel,
    }: {
        title: string;
        items: string[];
        emptyLabel: string;
    }) => (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {items.length > 0 ? (
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item} className="rounded-xl bg-muted/50 px-3 py-2 text-sm text-foreground">
                            {item}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            )}
        </div>
    );

    if (isLoading && !detailedCourse) {
        return (
            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <Skeleton className="min-h-[220px] rounded-3xl" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <Skeleton className="min-h-[160px] rounded-3xl" />
                    <Skeleton className="min-h-[160px] rounded-3xl" />
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-5">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]"
            >
                <Card className="overflow-hidden rounded-3xl border-border/60 bg-gradient-to-br from-card via-card to-muted/50 shadow-sm">
                    <CardHeader className="gap-4 border-b border-border/60 pb-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{copy.summaryTitle}</CardTitle>
                                        <CardDescription>{copy.pageDescription}</CardDescription>
                                    </div>
                                    {canEdit ? <CourseInfoEditModal course={detailedCourse} /> : null}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.code}</p>
                                <p className="mt-2 text-base font-semibold">{detailedCourse?.code || '—'}</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.crn}</p>
                                <p className="mt-2 text-base font-semibold">{(info && info.crn) || '—'}</p>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{copy.section}</p>
                                <p className="mt-2 text-base font-semibold">{(info && info.sectionName) || '—'}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
                            <p className="text-sm leading-7 text-foreground/90">{localizedSummary || copy.summaryFallback}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    <Card className="rounded-3xl border-border/60 bg-card/95 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-600">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>{copy.academicTitle}</CardTitle>
                                    <CardDescription>{copy.academicDescription}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <InfoRow label={copy.term} value={localizedTerm || '—'} />
                            <InfoRow label={copy.startDate} value={formatDate(info ? info.startDate : null)} />
                            <InfoRow label={copy.endDate} value={formatDate(info ? info.endDate : null)} />
                            <InfoRow label={copy.lastAccessDate} value={formatDate(info ? info.lastAccessDate : null)} />
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
                className="grid gap-4 lg:grid-cols-2"
            >
                <Card className="rounded-3xl border-border/60 bg-card/95 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600">
                                <Users2 className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>{copy.teamTitle}</CardTitle>
                                <CardDescription>{copy.teamDescription}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <ListBlock
                            title={copy.instructors}
                            items={info ? info.instructors : []}
                            emptyLabel={copy.noTeam}
                        />
                        <ListBlock
                            title={copy.assistants}
                            items={info ? info.assistants : []}
                            emptyLabel={copy.noAssistants}
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-border/60 bg-card/95 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-600">
                                <Clock3 className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle>{copy.scheduleTitle}</CardTitle>
                                <CardDescription>{copy.scheduleDescription}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {localizedSchedule.length > 0 ? (
                            localizedSchedule.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 px-4 py-3"
                                >
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                                    <p className="text-sm font-medium text-foreground">{item}</p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
                                {copy.noSchedule}
                            </div>
                        )}
                        {isFetching ? (
                            <p className="text-xs text-muted-foreground">Refreshing...</p>
                        ) : null}
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    );
};

export default CourseInfoPage;