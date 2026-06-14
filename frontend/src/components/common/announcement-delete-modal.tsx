import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteAnnouncement } from '@/services/announcements.service';

type AnnouncementDeleteModalProps = {
  announcementId: string;
  announcementTitle: string;
  courseId: string;
};

export function AnnouncementDeleteModal({ announcementId, announcementTitle, courseId }: AnnouncementDeleteModalProps) {
  const { t } = useTranslation('announcements');
  const copy = t('deleteModal', { returnObjects: true }) as {
    triggerLabel: string;
    title: string;
    description: string;
    announcementLabel: string;
    confirm: string;
    cancel: string;
    deleting: string;
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
      await deleteAnnouncement(announcementId);
      await queryClient.invalidateQueries({ queryKey: ['announcements'] });
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
          variant="destructive"
          size="icon"
          className="opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label={copy.triggerLabel}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">{announcementTitle}</p>
          <p>{courseId.toUpperCase()}</p>
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

export default AnnouncementDeleteModal;