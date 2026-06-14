import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createMaterial } from '@/services/materials.service';
import type { MaterialType } from '@/types/course-material';

type MaterialUploadModalProps = {
  courseId: string;
  triggerClassName?: string;
  onSuccess?: () => void | Promise<void>;
};

type MaterialUploadFormValues = {
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  type: MaterialType;
  externalUrl: string;
};

export function MaterialUploadModal({ courseId, triggerClassName, onSuccess }: MaterialUploadModalProps) {
  const { t } = useTranslation('courses');
  const copy = t('courses.materials.uploadModal', { returnObjects: true }) as {
    trigger: string;
    title: string;
    description: string;
    fields: {
      titleTr: string;
      titleEn: string;
      descriptionTr: string;
      descriptionEn: string;
      type: string;
      file: string;
      externalUrl: string;
    };
    placeholders: {
      titleTr: string;
      titleEn: string;
      descriptionTr: string;
      descriptionEn: string;
      externalUrl: string;
    };
    submit: string;
    submitting: string;
    success: string;
    error: string;
    validation: {
      required: string;
      fileOrUrl: string;
    };
  };
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialUploadFormValues>({
    defaultValues: {
      titleTr: '',
      titleEn: '',
      descriptionTr: '',
      descriptionEn: '',
      type: 'document',
      externalUrl: '',
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError('');
      setFile(null);
      reset();
    }
  };

  const onSubmit = async (values: MaterialUploadFormValues) => {
    setSubmitError('');

    if (!file && !values.externalUrl.trim()) {
      setSubmitError(copy.validation.fileOrUrl);
      return;
    }

    try {
      await createMaterial({
        courseId,
        titleTr: values.titleTr,
        titleEn: values.titleEn,
        descriptionTr: values.descriptionTr || undefined,
        descriptionEn: values.descriptionEn || undefined,
        type: values.type,
        externalUrl: values.externalUrl.trim() || undefined,
        file,
      });

      await queryClient.invalidateQueries({ queryKey: ['materials', courseId] });
      setOpen(false);
      await onSuccess?.();
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
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="material-title-tr">{copy.fields.titleTr}</Label>
              <Input id="material-title-tr" placeholder={copy.placeholders.titleTr} {...register('titleTr', { required: copy.validation.required })} />
              {errors.titleTr?.message && <p className="text-sm text-destructive">{errors.titleTr.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material-title-en">{copy.fields.titleEn}</Label>
              <Input id="material-title-en" placeholder={copy.placeholders.titleEn} {...register('titleEn', { required: copy.validation.required })} />
              {errors.titleEn?.message && <p className="text-sm text-destructive">{errors.titleEn.message}</p>}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="material-description-tr">{copy.fields.descriptionTr}</Label>
              <textarea id="material-description-tr" className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={copy.placeholders.descriptionTr} {...register('descriptionTr')} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material-description-en">{copy.fields.descriptionEn}</Label>
              <textarea id="material-description-en" className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={copy.placeholders.descriptionEn} {...register('descriptionEn')} />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="material-type">{copy.fields.type}</Label>
              <select id="material-type" className="h-10 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register('type', { required: copy.validation.required })}>
                <option value="lecture">{t('courses.materials.types.lecture')}</option>
                <option value="assignment">{t('courses.materials.types.assignment')}</option>
                <option value="exam">{t('courses.materials.types.exam')}</option>
                <option value="document">{t('courses.materials.types.document')}</option>
                <option value="video">{t('courses.materials.types.video')}</option>
                <option value="link">{t('courses.materials.types.link')}</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="material-file">{copy.fields.file}</Label>
              <Input id="material-file" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="material-external-url">{copy.fields.externalUrl}</Label>
            <Input id="material-external-url" placeholder={copy.placeholders.externalUrl} {...register('externalUrl')} />
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

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

export default MaterialUploadModal;