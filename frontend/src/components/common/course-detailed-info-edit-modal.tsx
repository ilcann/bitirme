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

type CourseDetailedInfoEditModalProps = {
    course: Course;
};

type CourseDetailedInfoFormValues = {
    language: string;
    credits: string;
    lectureHours: string;
    practiceHours: string;
    labHours: string;
    semester: string;
    coordinator: string;
    objectivesTr: string;
    objectivesEn: string;
    descriptionTr: string;
    descriptionEn: string;
    outcomesTr: string;
    outcomesEn: string;
    prerequisitesTr: string;
    prerequisitesEn: string;
    otherNotesTr: string;
    otherNotesEn: string;
    textbookTr: string;
    textbookEn: string;
    referencesTr: string;
    referencesEn: string;
};

function safeString(value: string | number | null | undefined) {
    return value === null || value === undefined ? '' : String(value);
}

function defaultValuesFromCourse(course: Course): CourseDetailedInfoFormValues {
    const info = course.info;

    return {
        language: safeString(info?.language),
        credits: safeString(info?.credits),
        lectureHours: safeString(info?.lectureHours),
        practiceHours: safeString(info?.practiceHours),
        labHours: safeString(info?.labHours),
        semester: safeString(info?.semester),
        coordinator: safeString(info?.coordinator),
        objectivesTr: safeString(info?.objectives.tr),
        objectivesEn: safeString(info?.objectives.en),
        descriptionTr: safeString(info?.description.tr),
        descriptionEn: safeString(info?.description.en),
        outcomesTr: safeString(info?.outcomes.tr),
        outcomesEn: safeString(info?.outcomes.en),
        prerequisitesTr: safeString(info?.prerequisites.tr),
        prerequisitesEn: safeString(info?.prerequisites.en),
        otherNotesTr: safeString(info?.otherNotes.tr),
        otherNotesEn: safeString(info?.otherNotes.en),
        textbookTr: safeString(info?.textbook.tr),
        textbookEn: safeString(info?.textbook.en),
        referencesTr: safeString(info?.references.tr),
        referencesEn: safeString(info?.references.en),
    };
}

export function CourseDetailedInfoEditModal({ course }: CourseDetailedInfoEditModalProps) {
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
                title: 'Ders bilgilerini duzenle',
                description: 'Bu form ders bilgileri sayfasindaki alanlari gunceller.',
                save: 'Kaydet',
                saving: 'Kaydediliyor...',
                error: 'Ders bilgileri guncellenemedi.',
                labels: {
                    language: 'Dersin Dili',
                    credits: 'Kredi',
                    lectureHours: 'Ders (saat/hafta)',
                    practiceHours: 'Uygulama (saat/hafta)',
                    labHours: 'Laboratuvar (saat/hafta)',
                    semester: 'Dönem',
                    coordinator: 'Dersin Koordinatörü',
                    objectivesTr: 'Dersin Amaçları (TR)',
                    objectivesEn: 'Course Objectives (EN)',
                    descriptionTr: 'Dersin Tanımı (TR)',
                    descriptionEn: 'Course Description (EN)',
                    outcomesTr: 'Ders Çıktıları (TR)',
                    outcomesEn: 'Course Outcomes (EN)',
                    prerequisitesTr: 'Ön Koşullar (TR)',
                    prerequisitesEn: 'Prerequisites (EN)',
                    otherNotesTr: 'Diğer (TR)',
                    otherNotesEn: 'Other (EN)',
                    textbookTr: 'Ders Kitabı (TR)',
                    textbookEn: 'Textbook (EN)',
                    referencesTr: 'Diğer Referanslar (TR)',
                    referencesEn: 'Other References (EN)',
                },
            };
        }

        return {
            trigger: 'Edit',
            title: 'Edit course information',
            description: 'Update the fields shown on the course information page.',
            save: 'Save',
            saving: 'Saving...',
            error: 'Failed to update course information.',
            labels: {
                language: 'Course Language',
                credits: 'Credits',
                lectureHours: 'Lecture (hours/week)',
                practiceHours: 'Practice (hours/week)',
                labHours: 'Lab (hours/week)',
                semester: 'Semester',
                coordinator: 'Course Coordinator',
                objectivesTr: 'Course Objectives (TR)',
                objectivesEn: 'Course Objectives (EN)',
                descriptionTr: 'Course Description (TR)',
                descriptionEn: 'Course Description (EN)',
                outcomesTr: 'Course Outcomes (TR)',
                outcomesEn: 'Course Outcomes (EN)',
                prerequisitesTr: 'Prerequisites (TR)',
                prerequisitesEn: 'Prerequisites (EN)',
                otherNotesTr: 'Other (TR)',
                otherNotesEn: 'Other (EN)',
                textbookTr: 'Textbook (TR)',
                textbookEn: 'Textbook (EN)',
                referencesTr: 'Other References (TR)',
                referencesEn: 'Other References (EN)',
            },
        };
    }, [isTurkish]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CourseDetailedInfoFormValues>({
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

    const onSubmit = async (values: CourseDetailedInfoFormValues) => {
        setSubmitError('');

        try {
            await updateInfo({
                courseId: course.id,
                info: {
                    language: values.language || null,
                    credits: values.credits ? Number(values.credits) : null,
                    lectureHours: values.lectureHours ? Number(values.lectureHours) : null,
                    practiceHours: values.practiceHours ? Number(values.practiceHours) : null,
                    labHours: values.labHours ? Number(values.labHours) : null,
                    semester: values.semester ? Number(values.semester) : null,
                    coordinator: values.coordinator || null,
                    objectives: {
                        tr: values.objectivesTr || null,
                        en: values.objectivesEn || null,
                    },
                    description: {
                        tr: values.descriptionTr || null,
                        en: values.descriptionEn || null,
                    },
                    outcomes: {
                        tr: values.outcomesTr || null,
                        en: values.outcomesEn || null,
                    },
                    prerequisites: {
                        tr: values.prerequisitesTr || null,
                        en: values.prerequisitesEn || null,
                    },
                    otherNotes: {
                        tr: values.otherNotesTr || null,
                        en: values.otherNotesEn || null,
                    },
                    textbook: {
                        tr: values.textbookTr || null,
                        en: values.textbookEn || null,
                    },
                    references: {
                        tr: values.referencesTr || null,
                        en: values.referencesEn || null,
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

    const textareaClassName = 'min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring';

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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="course-language">{copy.labels.language}</Label>
                            <Input id="course-language" {...register('language')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-credits">{copy.labels.credits}</Label>
                            <Input id="course-credits" type="number" min="0" {...register('credits')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-semester">{copy.labels.semester}</Label>
                            <Input id="course-semester" type="number" min="0" {...register('semester')} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="course-lecture-hours">{copy.labels.lectureHours}</Label>
                            <Input id="course-lecture-hours" type="number" min="0" {...register('lectureHours')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-practice-hours">{copy.labels.practiceHours}</Label>
                            <Input id="course-practice-hours" type="number" min="0" {...register('practiceHours')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-lab-hours">{copy.labels.labHours}</Label>
                            <Input id="course-lab-hours" type="number" min="0" {...register('labHours')} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="course-coordinator">{copy.labels.coordinator}</Label>
                        <Input id="course-coordinator" {...register('coordinator')} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-objectives-tr">{copy.labels.objectivesTr}</Label>
                            <textarea id="course-objectives-tr" className={textareaClassName} {...register('objectivesTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-objectives-en">{copy.labels.objectivesEn}</Label>
                            <textarea id="course-objectives-en" className={textareaClassName} {...register('objectivesEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-description-tr">{copy.labels.descriptionTr}</Label>
                            <textarea id="course-description-tr" className={textareaClassName} {...register('descriptionTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-description-en">{copy.labels.descriptionEn}</Label>
                            <textarea id="course-description-en" className={textareaClassName} {...register('descriptionEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-outcomes-tr">{copy.labels.outcomesTr}</Label>
                            <textarea id="course-outcomes-tr" className={textareaClassName} {...register('outcomesTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-outcomes-en">{copy.labels.outcomesEn}</Label>
                            <textarea id="course-outcomes-en" className={textareaClassName} {...register('outcomesEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-prerequisites-tr">{copy.labels.prerequisitesTr}</Label>
                            <textarea id="course-prerequisites-tr" className={textareaClassName} {...register('prerequisitesTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-prerequisites-en">{copy.labels.prerequisitesEn}</Label>
                            <textarea id="course-prerequisites-en" className={textareaClassName} {...register('prerequisitesEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-other-notes-tr">{copy.labels.otherNotesTr}</Label>
                            <textarea id="course-other-notes-tr" className={textareaClassName} {...register('otherNotesTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-other-notes-en">{copy.labels.otherNotesEn}</Label>
                            <textarea id="course-other-notes-en" className={textareaClassName} {...register('otherNotesEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-textbook-tr">{copy.labels.textbookTr}</Label>
                            <textarea id="course-textbook-tr" className={textareaClassName} {...register('textbookTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-textbook-en">{copy.labels.textbookEn}</Label>
                            <textarea id="course-textbook-en" className={textareaClassName} {...register('textbookEn')} />
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="course-references-tr">{copy.labels.referencesTr}</Label>
                            <textarea id="course-references-tr" className={textareaClassName} {...register('referencesTr')} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="course-references-en">{copy.labels.referencesEn}</Label>
                            <textarea id="course-references-en" className={textareaClassName} {...register('referencesEn')} />
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

export default CourseDetailedInfoEditModal;