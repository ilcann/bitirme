import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, Pencil } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseInstructorOptions } from '@/hooks/use-course-instructor-options';
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
    instructorIds: number[];
    assistantIds: number[];
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
        instructorIds: course.info && Array.isArray(course.info.instructorIds) ? course.info.instructorIds : [],
        assistantIds: course.info && Array.isArray(course.info.assistantIds) ? course.info.assistantIds : [],
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
    const { options: instructorOptions, isLoading: instructorOptionsLoading } = useCourseInstructorOptions({ enabled: open });
    const { updateInfo, isUpdating } = useCourseInfoMutation(course.id);

    const copy = useMemo(() => {
        if (isTurkish) {
            return {
                trigger: 'Düzenle',
                title: 'Ders özetini düzenle',
                description: 'Bu form ders özet kartında gösterilen bilgileri günceller.',
                save: 'Kaydet',
                saving: 'Kaydediliyor...',
                success: 'Ders bilgileri güncellendi.',
                error: 'Ders bilgileri güncellenemedi.',
                labels: {
                    summaryTr: 'Özet (TR)',
                    summaryEn: 'Summary (EN)',
                    sectionName: 'Sınıf',
                    crn: 'CRN',
                    termTr: 'Dönem (TR)',
                    termEn: 'Term (EN)',
                    startDate: 'Başlangıç',
                    endDate: 'Bitis',
                    lastAccessDate: 'Son erişim',
                    instructors: 'Eğitmenler',
                    assistants: 'Yardımcılar',
                    scheduleTr: 'Plan (TR)',
                    scheduleEn: 'Schedule (EN)',
                },
                tabs: {
                    summary: 'Özet',
                    academic: 'Akademik',
                    team: 'Ekip',
                    schedule: 'Plan',
                },
                help: {
                    multiSelect: 'Birden fazla seçim yapabilirsiniz.',
                    loadingInstructors: 'Eğitmen listesi yükleniyor...',
                    noSelection: 'Seçim yok',
                    selected: 'seçildi',
                    clear: 'Temizle',
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
            tabs: {
                summary: 'Summary',
                academic: 'Academic',
                team: 'Team',
                schedule: 'Schedule',
            },
            help: {
                multiSelect: 'You can select multiple instructors.',
                loadingInstructors: 'Loading instructor options...',
                noSelection: 'No selection',
                selected: 'selected',
                clear: 'Clear',
                date: 'YYYY-MM-DD',
            },
        };
    }, [isTurkish]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { isSubmitting },
    } = useForm<CourseInfoFormValues>({
        defaultValues: defaultValuesFromCourse(course),
    });

    const selectedInstructorIds = watch('instructorIds');
    const selectedAssistantIds = watch('assistantIds');

    useEffect(() => {
        register('instructorIds');
        register('assistantIds');
    }, [register]);

    const instructorOptionsById = useMemo(() => {
        const mapped = new Map<number, string>();

        for (const option of instructorOptions) {
            mapped.set(option.id, option.fullName);
        }

        return mapped;
    }, [instructorOptions]);

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
                    instructorIds: values.instructorIds,
                    assistantIds: values.assistantIds,
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

    const toggleUserSelection = (field: 'instructorIds' | 'assistantIds', userId: number) => {
        const current = field === 'instructorIds' ? selectedInstructorIds : selectedAssistantIds;
        const next = current.includes(userId)
            ? current.filter((id) => id !== userId)
            : [...current, userId];

        setValue(field, next, { shouldDirty: true });
    };

    const selectedInstructorNames = selectedInstructorIds
        .map((id) => instructorOptionsById.get(id))
        .filter((value): value is string => Boolean(value));
    const selectedAssistantNames = selectedAssistantIds
        .map((id) => instructorOptionsById.get(id))
        .filter((value): value is string => Boolean(value));

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
                    <Tabs defaultValue="summary" className="space-y-4">
                        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 p-1 sm:grid-cols-4">
                            <TabsTrigger value="summary">{copy.tabs.summary}</TabsTrigger>
                            <TabsTrigger value="academic">{copy.tabs.academic}</TabsTrigger>
                            <TabsTrigger value="team">{copy.tabs.team}</TabsTrigger>
                            <TabsTrigger value="schedule">{copy.tabs.schedule}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-4">
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
                        </TabsContent>

                        <TabsContent value="academic" className="space-y-4">
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
                        </TabsContent>

                        <TabsContent value="team" className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="course-instructors">{copy.labels.instructors}</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <span>
                                                    {selectedInstructorNames.length > 0
                                                        ? `${selectedInstructorNames.length} ${copy.help.selected}`
                                                        : copy.help.noSelection}
                                                </span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="max-h-72 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
                                            <DropdownMenuLabel>{copy.labels.instructors}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {instructorOptions.map((option) => (
                                                <DropdownMenuCheckboxItem
                                                    key={option.id}
                                                    checked={selectedInstructorIds.includes(option.id)}
                                                    onCheckedChange={() => toggleUserSelection('instructorIds', option.id)}
                                                    disabled={instructorOptionsLoading}
                                                >
                                                    <span className="truncate">{option.fullName} ({option.email})</span>
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedInstructorNames.length > 0 ? selectedInstructorNames.map((name) => (
                                            <Badge key={name} variant="secondary" className="rounded-full">
                                                <Check className="mr-1 h-3 w-3" />
                                                {name}
                                            </Badge>
                                        )) : <span className="text-xs text-muted-foreground">{copy.help.noSelection}</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {instructorOptionsLoading ? copy.help.loadingInstructors : copy.help.multiSelect}
                                    </p>
                                    {selectedInstructorIds.length > 0 ? (
                                        <Button type="button" variant="ghost" size="sm" className="w-fit px-0" onClick={() => setValue('instructorIds', [], { shouldDirty: true })}>
                                            {copy.help.clear}
                                        </Button>
                                    ) : null}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="course-assistants">{copy.labels.assistants}</Label>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full justify-between">
                                                <span>
                                                    {selectedAssistantNames.length > 0
                                                        ? `${selectedAssistantNames.length} ${copy.help.selected}`
                                                        : copy.help.noSelection}
                                                </span>
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="max-h-72 w-(--radix-dropdown-menu-trigger-width) overflow-y-auto">
                                            <DropdownMenuLabel>{copy.labels.assistants}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {instructorOptions.map((option) => (
                                                <DropdownMenuCheckboxItem
                                                    key={option.id}
                                                    checked={selectedAssistantIds.includes(option.id)}
                                                    onCheckedChange={() => toggleUserSelection('assistantIds', option.id)}
                                                    disabled={instructorOptionsLoading}
                                                >
                                                    <span className="truncate">{option.fullName} ({option.email})</span>
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAssistantNames.length > 0 ? selectedAssistantNames.map((name) => (
                                            <Badge key={name} variant="secondary" className="rounded-full">
                                                <Check className="mr-1 h-3 w-3" />
                                                {name}
                                            </Badge>
                                        )) : <span className="text-xs text-muted-foreground">{copy.help.noSelection}</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {instructorOptionsLoading ? copy.help.loadingInstructors : copy.help.multiSelect}
                                    </p>
                                    {selectedAssistantIds.length > 0 ? (
                                        <Button type="button" variant="ghost" size="sm" className="w-fit px-0" onClick={() => setValue('assistantIds', [], { shouldDirty: true })}>
                                            {copy.help.clear}
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-4">
                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="course-schedule-tr">{copy.labels.scheduleTr}</Label>
                                    <textarea id="course-schedule-tr" className={textAreaClassName} {...register('scheduleTr')} />
                                    <p className="text-xs text-muted-foreground">{isTurkish ? 'Her satıra bir kayıt yazın.' : 'Use one item per line.'}</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="course-schedule-en">{copy.labels.scheduleEn}</Label>
                                    <textarea id="course-schedule-en" className={textAreaClassName} {...register('scheduleEn')} />
                                    <p className="text-xs text-muted-foreground">{isTurkish ? 'Her satıra bir kayıt yazın.' : 'Use one item per line.'}</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

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