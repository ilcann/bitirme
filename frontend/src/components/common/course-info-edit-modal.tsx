import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCourseInfoMutation } from '@/hooks/use-course-info-mutation';
import { useLanguage } from '@/providers/language-provider';
import type { Course } from '@/types/course';

type CourseInfoEditModalProps = {
    course: Course;
};

type CourseInfoFormValues = {
    summaryTr: string;
    summaryEn: string;
    sectionName: string;
    crn: string;
    termTr: string;
    termEn: string;
    startDate: string;
    endDate: string;
    lastAccessDate: string;
    instructors: string;
    assistants: string;
    scheduleTr: string;
    scheduleEn: string;
};

function toMultilineValue(items: string[] | undefined) {
    return items && items.length > 0 ? items.join('\n') : '';
}

function defaultValuesFromCourse(course: Course): CourseInfoFormValues {
    return {
        summaryTr: course.info && course.info.summary.tr ? course.info.summary.tr : '',
        summaryEn: course.info && course.info.summary.en ? course.info.summary.en : '',
        sectionName: course.info && course.info.sectionName ? course.info.sectionName : '',
        crn: course.info && course.info.crn ? course.info.crn : '',
        termTr: course.info && course.info.term.tr ? course.info.term.tr : '',
        termEn: course.info && course.info.term.en ? course.info.term.en : '',
        startDate: course.info && course.info.startDate ? course.info.startDate : '',
        endDate: course.info && course.info.endDate ? course.info.endDate : '',
        lastAccessDate: course.info && course.info.lastAccessDate ? course.info.lastAccessDate : '',
        instructors: toMultilineValue(course.info ? course.info.instructors : []),
        assistants: toMultilineValue(course.info ? course.info.assistants : []),
        scheduleTr: toMultilineValue(course.info ? course.info.schedule.tr : []),
        scheduleEn: toMultilineValue(course.info ? course.info.schedule.en : []),
    };
}

export function CourseInfoEditModal({ course }: CourseInfoEditModalProps) {
    const { lang } = useLanguage();
    const queryClient = useQueryClient();
    const isTurkish = lang === 'tr';
    const [open, setOpen] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { updateInfo, isUpdating } = useCourseInfoMutation(course.id);

    const copy = useMemo(() => {
        if (isTurkish) {
            return {
                trigger: 'Duzenle',
                title: 'Ders ozetini duzenle',
                description: 'Bu form kurs ozet kartinda gosterilen bilgileri gunceller.',
                save: 'Kaydet',
                saving: 'Kaydediliyor...',
                success: 'Ders bilgileri guncellendi.',
                error: 'Ders bilgileri guncellenemedi.',
                labels: {
                    summaryTr: 'Ozet (TR)',
                    summaryEn: 'Summary (EN)',
                    sectionName: 'Sinif',
                    crn: 'CRN',
                    termTr: 'Donem (TR)',
                    termEn: 'Term (EN)',
                    startDate: 'Baslangic',
                    endDate: 'Bitis',
                    lastAccessDate: 'Son erisim',
                    instructors: 'Egitmenler',
                    assistants: 'Yardimcilar',
                    scheduleTr: 'Plan (TR)',
                    scheduleEn: 'Schedule (EN)',
                },
                help: {
                    multiLine: 'Her satira bir kayit yazin.',
                    date: 'YYYY-MM-DD',
                },
            };
        }

        return {
            trigger: 'Edit',
            title: 'Edit course summary',
            description: 'Update the details shown on the summary cards.',
            save: 'Save',
            saving: 'Saving...',
            success: 'Course information updated.',
            error: 'Failed to update course information.',
            labels: {
                summaryTr: 'Summary (TR)',
                summaryEn: 'Summary (EN)',
                sectionName: 'Section',
                crn: 'CRN',
                termTr: 'Term (TR)',
                termEn: 'Term (EN)',
                startDate: 'Start date',
                endDate: 'End date',
                lastAccessDate: 'Last access',
                instructors: 'Instructors',
                assistants: 'Assistants',
                scheduleTr: 'Schedule (TR)',
                scheduleEn: 'Schedule (EN)',
            },
            help: {
                multiLine: 'Use one item per line.',
                date: 'YYYY-MM-DD',
            },
        };
    }, [isTurkish]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CourseInfoFormValues>({
        defaultValues: defaultValuesFromCourse(course),
    });

    useEffect(() => {
        if (open) {
            reset(defaultValuesFromCourse(course));
        }
    }, [course, open, reset]);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        setSubmitError('');

        if (!nextOpen) {
            reset(defaultValuesFromCourse(course));
        }
    };

    const onSubmit = async (values: CourseInfoFormValues) => {
        setSubmitError('');

        try {
            await updateInfo({
                courseId: course.id,
                info: {
                    summary: {
                        tr: values.summaryTr || null,
                        en: values.summaryEn || null,
                    },
                    sectionName: values.sectionName || null,
                    crn: values.crn || null,
                    term: {
                        tr: values.termTr || null,
                        en: values.termEn || null,
                    },
                    startDate: values.startDate || null,
                    endDate: values.endDate || null,
                    lastAccessDate: values.lastAccessDate || null,
                    instructors: values.instructors.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
                    assistants: values.assistants.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
                    schedule: {
                        tr: values.scheduleTr.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
                        en: values.scheduleEn.split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
                    },
                },
            });

            await queryClient.invalidateQueries({ queryKey: ['course-info', course.id] });
            await queryClient.invalidateQueries({ queryKey: ['course', course.id] });
            setOpen(false);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : copy.error);
        }
    };

    const textAreaClassName = 'min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                    <Pencil className="h-4 w-4" />
                    {copy.trigger}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{copy.title}</DialogTitle>
                    <DialogDescription>{copy.description}</DialogDescription>
                </DialogHeader>

                <form className="grid gap-5 pt-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-summary-tr">{copy.labels.summaryTr}</Label>
                            <textarea id="course-summary-tr" className={textAreaClassName} {...register('summaryTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-summary-en">{copy.labels.summaryEn}</Label>
                            <textarea id="course-summary-en" className={textAreaClassName} {...register('summaryEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="grid gap-2">
                            <Label htmlFor="course-section-name">{copy.labels.sectionName}</Label>
                            <Input id="course-section-name" {...register('sectionName')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-crn">{copy.labels.crn}</Label>
                            <Input id="course-crn" {...register('crn')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-term-tr">{copy.labels.termTr}</Label>
                            <Input id="course-term-tr" {...register('termTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-term-en">{copy.labels.termEn}</Label>
                            <Input id="course-term-en" {...register('termEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="course-start-date">{copy.labels.startDate}</Label>
                            <Input id="course-start-date" placeholder={copy.help.date} {...register('startDate')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-end-date">{copy.labels.endDate}</Label>
                            <Input id="course-end-date" placeholder={copy.help.date} {...register('endDate')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-last-access-date">{copy.labels.lastAccessDate}</Label>
                            <Input id="course-last-access-date" placeholder={copy.help.date} {...register('lastAccessDate')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-instructors">{copy.labels.instructors}</Label>
                            <textarea id="course-instructors" className={textAreaClassName} {...register('instructors')} />
                            <p className="text-xs text-muted-foreground">{copy.help.multiLine}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-assistants">{copy.labels.assistants}</Label>
                            <textarea id="course-assistants" className={textAreaClassName} {...register('assistants')} />
                            <p className="text-xs text-muted-foreground">{copy.help.multiLine}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-schedule-tr">{copy.labels.scheduleTr}</Label>
                            <textarea id="course-schedule-tr" className={textAreaClassName} {...register('scheduleTr')} />
                            <p className="text-xs text-muted-foreground">{copy.help.multiLine}</p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-schedule-en">{copy.labels.scheduleEn}</Label>
                            <textarea id="course-schedule-en" className={textAreaClassName} {...register('scheduleEn')} />
                            <p className="text-xs text-muted-foreground">{copy.help.multiLine}</p>
                        </div>
                    </div>

                    {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting || isUpdating} className="w-full sm:w-auto">
                            {isSubmitting || isUpdating ? copy.saving : copy.save}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CourseInfoEditModal;