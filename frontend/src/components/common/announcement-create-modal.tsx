import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAnnouncement } from '@/services/announcements.service';
import { useCoursesCompact } from '@/hooks/use-courses-compact';
import type { AnnouncementCreateRequest } from '@/services/types';
import type { AudienceKey } from '@/config/audiences';

type AnnouncementCreateModalProps = {
  courseId?: string;
  audience?: AudienceKey;
  triggerClassName?: string;
};

export function AnnouncementCreateModal({ courseId, audience, triggerClassName }: AnnouncementCreateModalProps) {
  const { t } = useTranslation('announcements');
  const copy = t('createModal', { returnObjects: true }) as {
    trigger: string;
    title: string;
    description: string;
    fields: {
      course: string;
      titleTr: string;
      titleEn: string;
      descriptionTr: string;
      descriptionEn: string;
      audience: string;
      isNew: string;
    };
    placeholders: {
      titleTr: string;
      titleEn: string;
      descriptionTr: string;
      descriptionEn: string;
    };
    options: {
      department: string;
      common: string;
    };
    validation: {
      required: string;
    };
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
  const queryClient = useQueryClient();
  const { courses, isLoading: coursesLoading } = useCoursesCompact({ audience });
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementCreateRequest>({
    defaultValues: {
      courseId: courseId || '',
      titleTr: '',
      titleEn: '',
      descriptionTr: '',
      descriptionEn: '',
      audience: audience || 'department',
      isNew: false,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError('');
      setSubmitSuccess('');
      reset({
        courseId: courseId || '',
        titleTr: '',
        titleEn: '',
        descriptionTr: '',
        descriptionEn: '',
        audience: audience || 'department',
        isNew: false,
      });
    }
  };

  const onSubmit = async (values: AnnouncementCreateRequest) => {
    setSubmitError('');
    setSubmitSuccess('');

    try {
      await createAnnouncement({
        ...values,
        courseId: courseId || values.courseId,
      });
      await queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setSubmitSuccess(copy.success);
      setOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus className="h-4 w-4" />
          {copy.trigger}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
          {!courseId ? (
            <div className="grid gap-2">
              <Label htmlFor="announcement-course">{copy.fields.course}</Label>
              <select
                id="announcement-course"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('courseId', { required: copy.validation.required })}
                disabled={coursesLoading}
              >
                <option value="">{copy.fields.course}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title.tr}
                  </option>
                ))}
              </select>
              {errors.courseId?.message && <p className="text-sm text-destructive">{errors.courseId.message}</p>}
            </div>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="announcement-title-tr">{copy.fields.titleTr}</Label>
              <Input
                id="announcement-title-tr"
                placeholder={copy.placeholders.titleTr}
                {...register('titleTr', { required: copy.validation.required })}
              />
              {errors.titleTr?.message && <p className="text-sm text-destructive">{errors.titleTr.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="announcement-title-en">{copy.fields.titleEn}</Label>
              <Input
                id="announcement-title-en"
                placeholder={copy.placeholders.titleEn}
                {...register('titleEn', { required: copy.validation.required })}
              />
              {errors.titleEn?.message && <p className="text-sm text-destructive">{errors.titleEn.message}</p>}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="announcement-description-tr">{copy.fields.descriptionTr}</Label>
              <textarea
                id="announcement-description-tr"
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={copy.placeholders.descriptionTr}
                {...register('descriptionTr', { required: copy.validation.required })}
              />
              {errors.descriptionTr?.message && <p className="text-sm text-destructive">{errors.descriptionTr.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="announcement-description-en">{copy.fields.descriptionEn}</Label>
              <textarea
                id="announcement-description-en"
                className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder={copy.placeholders.descriptionEn}
                {...register('descriptionEn', { required: copy.validation.required })}
              />
              {errors.descriptionEn?.message && <p className="text-sm text-destructive">{errors.descriptionEn.message}</p>}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="announcement-audience">{copy.fields.audience}</Label>
              <select
                id="announcement-audience"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('audience', { required: copy.validation.required })}
              >
                <option value="department">{copy.options.department}</option>
                <option value="common">{copy.options.common}</option>
              </select>
              {errors.audience?.message && <p className="text-sm text-destructive">{errors.audience.message}</p>}
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-input" {...register('isNew')} />
                {copy.fields.isNew}
              </label>
            </div>
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          {submitSuccess ? <p className="text-sm text-emerald-600">{submitSuccess}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? copy.submitting : copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AnnouncementCreateModal;