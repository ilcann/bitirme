import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCourse } from '@/services/courses.service';
import type { CreateCourseRequest } from '@/services/types';

type CourseCreateModalProps = {
  triggerClassName?: string;
};

const colorOptions = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const;

export function CourseCreateModal({ triggerClassName }: CourseCreateModalProps) {
  const { t } = useTranslation('courses');
  const copy = t('createModal', { returnObjects: true }) as {
    trigger: string;
    title: string;
    description: string;
    fields: {
      code: string;
      titleTr: string;
      titleEn: string;
      audience: string;
      color: string;
    };
    placeholders: {
      titleTr: string;
      titleEn: string;
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
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseRequest>({
    defaultValues: {
      code: '',
      titleTr: '',
      titleEn: '',
      audience: 'department',
      color: 'chart-1',
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError('');
      setSubmitSuccess('');
      reset({
        code: '',
        titleTr: '',
        titleEn: '',
        audience: 'department',
        color: 'chart-1',
      });
    }
  };

  const onSubmit = async (values: CreateCourseRequest) => {
    setSubmitError('');
    setSubmitSuccess('');

    try {
      await createCourse(values);
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      await queryClient.invalidateQueries({ queryKey: ['courses-compact'] });
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

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 pt-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="course-code">{copy.fields.code}</Label>
            <Input
              id="course-code"
              placeholder="MAT 101/E"
              {...register('code', { required: copy.validation.required })}
            />
            {errors.code?.message && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="course-title-tr">{copy.fields.titleTr}</Label>
              <Input
                id="course-title-tr"
                placeholder={copy.placeholders.titleTr}
                {...register('titleTr', { required: copy.validation.required })}
              />
              {errors.titleTr?.message && <p className="text-sm text-destructive">{errors.titleTr.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-title-en">{copy.fields.titleEn}</Label>
              <Input
                id="course-title-en"
                placeholder={copy.placeholders.titleEn}
                {...register('titleEn', { required: copy.validation.required })}
              />
              {errors.titleEn?.message && <p className="text-sm text-destructive">{errors.titleEn.message}</p>}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="course-audience">{copy.fields.audience}</Label>
              <select
                id="course-audience"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('audience', { required: copy.validation.required })}
              >
                <option value="department">{copy.options.department}</option>
                <option value="common">{copy.options.common}</option>
              </select>
              {errors.audience?.message && <p className="text-sm text-destructive">{errors.audience.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="course-color">{copy.fields.color}</Label>
              <select
                id="course-color"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('color', { required: copy.validation.required })}
              >
                {colorOptions.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
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

export default CourseCreateModal;