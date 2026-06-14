import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { enrollStudents } from '@/services/courses.service';
import type { AvailableCourseStudent, EnrollStudentsRequest } from '@/services/types';
import { useAvailableCourseStudents } from '@/hooks/use-available-course-students';

type CourseEnrollStudentsModalProps = {
  courseId: string;
  triggerClassName?: string;
  onSuccess?: () => void;
};

export function CourseEnrollStudentsModal({ courseId, triggerClassName, onSuccess }: CourseEnrollStudentsModalProps) {
  const { t } = useTranslation('courses');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const triggerText = t('students.enrollModal.trigger', 'Öğrenci Ekle');
  const titleText = t('students.enrollModal.title', 'Derse öğrenci ekle');
  const descriptionText = t('students.enrollModal.description', 'Listeden bir veya daha fazla öğrenciyi seçerek derse kaydedin.');
  const searchLabelText = t('students.enrollModal.searchLabel', 'Öğrenci ara');
  const searchPlaceholderText = t('students.enrollModal.searchPlaceholder', 'Ad, soyad, e-posta veya öğrenci no ile ara');
  const totalLabelText = t('students.enrollModal.totalLabel', 'öğrenci bulundu');
  const selectedLabelText = t('students.enrollModal.selectedLabel', 'öğrenci seçildi');
  const submitText = t('students.enrollModal.submit', 'Seçilenleri Kaydet');
  const submittingText = t('students.enrollModal.submitting', 'Kaydediliyor...');
  const successText = t('students.enrollModal.success', 'Öğrenciler başarıyla eklendi.');
  const errorText = t('students.enrollModal.error', 'Öğrenciler eklenemedi.');
  const noResultsText = t('students.enrollModal.noResults', 'Sonuç bulunamadı.');
  const noStudentsText = t('students.enrollModal.noStudents', 'Eklenebilir öğrenci yok.');
  const selectionRequiredText = t('students.enrollModal.selectionRequired', 'En az bir öğrenci seçmelisiniz.');
  const selectAllText = t('students.enrollModal.selectAll', 'Tümünü seç');
  const clearAllText = t('students.enrollModal.clearAll', 'Seçimi temizle');
  const cancelText = t('students.enrollModal.cancel', 'İptal');

  const {
    students,
    total,
    hasNextPage,
    searchQuery,
    isLoading,
    isFetching,
    isFetchingNextPage,
    updateSearch,
    loadMore,
    resetPagination,
  } = useAvailableCourseStudents({
    courseId: open ? courseId : undefined,
    initialLimit: 5,
  });

  const filteredStudents = students;
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const mutation = useMutation({
    mutationFn: (request: EnrollStudentsRequest) => enrollStudents(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['course-students', courseId] });
      await queryClient.invalidateQueries({ queryKey: ['available-course-students', courseId] });
      setSubmitSuccess(successText);
      setOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      setSubmitError(error instanceof Error ? error.message : errorText);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSelectedIds([]);
      setSubmitError('');
      setSubmitSuccess('');
      resetPagination();
    }
  };

  const toggleStudent = (studentId: number) => {
    setSelectedIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId]
    );
  };

  const selectAllVisible = () => {
    setSelectedIds(filteredStudents.map((student) => student.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  useEffect(() => {
    if (!open || !listContainerRef.current || !sentinelRef.current) {
      return;
    }

    const container = listContainerRef.current;
    const sentinel = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        root: container,
        rootMargin: '120px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, loadMore, open]);

  const onSubmit = async () => {
    setSubmitError('');
    setSubmitSuccess('');

    if (!selectedIds.length) {
      setSubmitError(selectionRequiredText);
      return;
    }

    mutation.mutate({
      courseId,
      studentIds: selectedIds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus className="h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="student-search">{searchLabelText}</Label>
            <Input
              id="student-search"
              value={searchQuery}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder={searchPlaceholderText}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>{total} {totalLabelText}</span>
            <span>{selectedIds.length} {selectedLabelText}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={selectAllVisible} disabled={!filteredStudents.length || isFetching}>
              {selectAllText}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={!selectedIds.length}>
              {clearAllText}
            </Button>
          </div>

          <div ref={listContainerRef} className="max-h-105 overflow-auto rounded-2xl border bg-background/60 p-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{submittingText}</p>
            ) : filteredStudents.length ? (
              <div className="grid gap-2">
                {filteredStudents.map((student: AvailableCourseStudent) => {
                  const isSelected = selectedIds.includes(student.id);

                  return (
                    <label
                      key={student.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors ${
                        isSelected ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {student.studentNumber || student.email}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input"
                        checked={isSelected}
                        onChange={() => toggleStudent(student.id)}
                      />
                    </label>
                  );
                })}
                <div ref={sentinelRef} className="h-4 w-full" />
                {isFetchingNextPage ? <p className="pb-1 text-center text-xs text-muted-foreground">{submittingText}</p> : null}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {searchQuery ? noResultsText : noStudentsText}
              </div>
            )}
          </div>

          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          {submitSuccess ? <p className="text-sm text-emerald-600">{submitSuccess}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
              {cancelText}
            </Button>
            <Button type="button" onClick={onSubmit} disabled={mutation.isPending || !selectedIds.length} className="w-full sm:w-auto">
              {mutation.isPending ? submittingText : submitText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CourseEnrollStudentsModal;