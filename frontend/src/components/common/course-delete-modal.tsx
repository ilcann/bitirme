import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteCourse } from '@/services/courses.service';

type CourseDeleteModalProps = {
  courseId: string;
  courseCode: string;
  courseTitle: string;
};

export function CourseDeleteModal({ courseId, courseCode, courseTitle }: CourseDeleteModalProps) {
  const { t } = useTranslation('courses');
  const copy = t('deleteModal', { returnObjects: true }) as {
    triggerLabel: string;
    title: string;
    description: string;
    courseLabel: string;
    confirm: string;
    cancel: string;
    deleting: string;
    success: string;
    error: string;
  };
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSubmitError('');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setSubmitError('');

    try {
      await deleteCourse(courseId);
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      await queryClient.invalidateQueries({ queryKey: ['courses-compact'] });
      setOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="opacity-0 text-destructive hover:bg-destructive hover:text-white shadow-lg transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label={copy.triggerLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{courseCode}</p>
          <p>{courseTitle}</p>
        </div>

        {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
            {copy.cancel}
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? copy.deleting : copy.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CourseDeleteModal;