import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, LogIn, Search, Save, Settings2, X } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import NotFoundedPage from '@/pages/errors/not-founded';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useCourseGrades } from '@/hooks/use-course-grades';
import { useCourseGradesPagination } from '@/hooks/use-course-grades-pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Course, CourseGradeDistribution, CourseGradeItemType, CourseGradeStudent } from '@/services/types';

const COURSE_GRADE_TYPES: Array<{ type: CourseGradeItemType; label: string }> = [
  { type: 'midterm', label: 'Ara Sınav' },
  { type: 'final', label: 'Final' },
  { type: 'project', label: 'Proje' },
  { type: 'homework', label: 'Ödev' },
  { type: 'quiz', label: 'Kısa Sınav' },
];

const DIST_KEYS: Record<CourseGradeItemType, keyof CourseGradeDistribution> = {
  midterm: 'midtermCount',
  final: 'finalCount',
  project: 'projectCount',
  homework: 'homeworkCount',
  quiz: 'quizCount',
};

const WEIGHT_KEYS: Record<CourseGradeItemType, keyof CourseGradeDistribution> = {
  midterm: 'midtermWeight',
  final: 'finalWeight',
  project: 'projectWeight',
  homework: 'homeworkWeight',
  quiz: 'quizWeight',
};

function formatScore(score: number | null | undefined) {
  if (score === null || score === undefined) {
    return '-';
  }

  return score.toFixed(1);
}

function getStudentLabel(student: CourseGradeStudent) {
  return `${student.firstName} ${student.lastName}`;
}

function getAverageTone(score: number | null) {
  if (score === null) {
    return 'bg-muted text-muted-foreground';
  }

  if (score >= 85) {
    return 'bg-emerald-600/10 text-emerald-700 border-emerald-600/20';
  }

  if (score >= 70) {
    return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
  }

  return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
}

const CourseGradesPage = () => {
  const { t } = useTranslation('courses');
  const { user, openLogin } = useAuth();
  const { course } = useOutletContext<{ course: Course }>();
  const gradesTitle = 'Notlar';
  const canEditGrades = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';
  const canEditDistribution = user?.role === 'ADMIN';
  const canViewGrades = Boolean(user) && canEditGrades;

  useDocumentTitle(
    `${course?.code} - ${gradesTitle}`,
    t('courses.grades.description')
  );

  const {
    grades,
    total,
    distribution,
    isLoading,
    isFetching,
    isUpdatingGrade,
    isUpdatingDistribution,
    updateGrade,
    updateDistribution,
  } = useCourseGrades(course?.id, Boolean(user) && canEditGrades);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    filteredStudents,
    totalPages,
    normalizedSearchQuery,
    sortState,
    setSortState,
  } = useCourseGradesPagination(grades);

  const [distributionDraft, setDistributionDraft] = useState<CourseGradeDistribution | null>(null);
  const [isDistributionOpen, setIsDistributionOpen] = useState(false);
  const [gradeSort, setGradeSort] = useState<{
    type: CourseGradeItemType;
    itemNumber: number;
    direction: 'asc' | 'desc';
  } | null>(null);

  const activeSearchCount = normalizedSearchQuery ? filteredStudents.length : total;

  const columns = useMemo(() => {
    if (!distribution) {
      return COURSE_GRADE_TYPES.map((entry) => ({ type: entry.type, label: entry.label, count: 0 }));
    }

    return COURSE_GRADE_TYPES.map((entry) => ({
      type: entry.type,
      label: entry.label,
      count: distribution[DIST_KEYS[entry.type]],
    }));
  }, [distribution]);

  const groupedColumns = useMemo(
    () => columns.filter((column) => column.count > 0),
    [columns],
  );

  const gradeColumns = useMemo(
    () => groupedColumns.flatMap((column) =>
      Array.from({ length: column.count }, (_, index) => ({
        type: column.type,
        label: column.label,
        itemNumber: index + 1,
      }))),
    [groupedColumns],
  );

  const sortedStudents = useMemo(() => {
    const items = [...filteredStudents];

    if (!gradeSort) {
      return items;
    }

    items.sort((left, right) => {
      const leftGrade = left.grades.find(
        (grade) => grade.itemType === gradeSort.type && grade.itemNumber === gradeSort.itemNumber,
      )?.score;
      const rightGrade = right.grades.find(
        (grade) => grade.itemType === gradeSort.type && grade.itemNumber === gradeSort.itemNumber,
      )?.score;

      if (leftGrade === null || leftGrade === undefined) {
        if (rightGrade === null || rightGrade === undefined) {
          return 0;
        }

        return 1;
      }

      if (rightGrade === null || rightGrade === undefined) {
        return -1;
      }

      if (leftGrade === rightGrade) {
        const leftName = `${left.firstName} ${left.lastName}`;
        const rightName = `${right.firstName} ${right.lastName}`;

        return leftName.localeCompare(rightName, 'tr', { sensitivity: 'base' });
      }

      return gradeSort.direction === 'asc' ? leftGrade - rightGrade : rightGrade - leftGrade;
    });

    return items;
  }, [filteredStudents, gradeSort]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedStudents.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, sortedStudents]);

  const distributionWeightTotal = useMemo(() => {
    if (!distributionDraft) {
      return 0;
    }

    return COURSE_GRADE_TYPES.reduce((sum, entry) => {
      const countKey = DIST_KEYS[entry.type];
      const weightKey = WEIGHT_KEYS[entry.type];

      if (distributionDraft[countKey] <= 0) {
        return sum;
      }

      return sum + Number(distributionDraft[weightKey] || 0);
    }, 0);
  }, [distributionDraft]);

  const hasAnyDistributionItem = useMemo(() => {
    if (!distributionDraft) {
      return false;
    }

    return COURSE_GRADE_TYPES.some((entry) => distributionDraft[DIST_KEYS[entry.type]] > 0);
  }, [distributionDraft]);

  const isDistributionWeightValid = hasAnyDistributionItem && distributionWeightTotal === 100;

  const handleUpdateGrade = async (
    studentId: number,
    itemType: CourseGradeItemType,
    itemNumber: number,
    score: number | null,
  ) => {
    if (!course?.id || !canEditGrades) {
      return;
    }

    await updateGrade({
      courseId: course.id,
      studentId,
      itemType,
      itemNumber,
      score,
    });
  };

  const handleSaveDistribution = async () => {
    if (!course?.id || !distributionDraft || !canEditDistribution || !isDistributionWeightValid) {
      return;
    }

    await updateDistribution({
      courseId: course.id,
      distribution: distributionDraft,
    });
    setIsDistributionOpen(false);
  };

  const openDistributionEditor = () => {
    setDistributionDraft(distribution);
    setIsDistributionOpen(true);
  };

  const handleGradeSort = (type: CourseGradeItemType, itemNumber: number) => {
    setCurrentPage(1);
    setGradeSort((current) => {
      if (!current || current.type !== type || current.itemNumber !== itemNumber) {
        return { type, itemNumber, direction: 'asc' };
      }

      return {
        ...current,
        direction: current.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  };

  if (!user) {
    return (
      <section className="space-y-6">
        <Card className="border-2">
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <div className="rounded-full bg-muted p-4">
              <LogIn className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {t('courses.grades.loginRequiredTitle', { defaultValue: 'Giriş gerekli' })}
              </h3>
              <p className="max-w-lg text-sm text-muted-foreground">
                {t('courses.grades.loginRequiredDescription', {
                  defaultValue: 'Notları görüntülemek için lütfen giriş yapın.',
                })}
              </p>
            </div>
            <Button onClick={openLogin} className="rounded-full">
              {t('courses.grades.loginRequiredAction', { defaultValue: 'Giriş Yap' })}
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!canViewGrades) {
    return <NotFoundedPage />;
  }

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 rounded-2xl border bg-card/80 p-5 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{gradesTitle}</h2>
          <p className="text-sm text-muted-foreground">{t('courses.grades.description')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
            {total} {t('courses.students.count')}
          </Badge>
          {canEditDistribution ? (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={openDistributionEditor}
              disabled={isUpdatingDistribution}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              {t('courses.grades.distributionButton', { defaultValue: 'Not dağılımını düzenle' })}
            </Button>
          ) : null}
        </div>
      </motion.div>

      <Card>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('courses.students.search.placeholder')}
                className="h-11 rounded-xl border-2 pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{t('courses.students.search.help')}</span>
              {isFetching && !isLoading ? <span>• {t('courses.students.loading')}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('courses.students.sortingHint', { sortLabel: sortState.direction === 'asc' ? t('courses.students.sort.asc') : t('courses.students.sort.desc') })}
            </span>
            <Button
              variant={sortState.key === 'name' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => setSortState((current) => ({ key: 'name', direction: current.key === 'name' && current.direction === 'asc' ? 'desc' : 'asc' }))}
            >
              {t('courses.students.table.name')}
            </Button>
            <Button
              variant={sortState.key === 'studentNumber' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => setSortState((current) => ({ key: 'studentNumber', direction: current.key === 'studentNumber' && current.direction === 'asc' ? 'desc' : 'asc' }))}
            >
              {t('courses.students.table.studentNumber')}
            </Button>
            {normalizedSearchQuery ? (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium">
                {t('courses.students.search.results', { count: activeSearchCount })}
              </Badge>
            ) : null}
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              {t('courses.grades.loading', { defaultValue: 'Notlar yükleniyor...' })}
            </div>
          ) : paginatedStudents.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">
                {normalizedSearchQuery ? t('courses.students.empty.searchTitle') : t('courses.grades.emptyTitle', { defaultValue: 'Henüz not yok' })}
              </h3>
              <p className="text-sm text-muted-foreground">
                {normalizedSearchQuery ? t('courses.students.empty.searchDescription') : t('courses.grades.emptyDescription', { defaultValue: 'Bu ders için not girdisi bulunmuyor.' })}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32 align-middle" rowSpan={2}>{t('courses.students.table.studentNumber')}</TableHead>
                      <TableHead className="align-middle" rowSpan={2}>{t('courses.students.table.name')}</TableHead>
                      {groupedColumns.map((column, index) => (
                        <TableHead
                          key={column.type}
                          className={`min-w-20 text-center ${index < groupedColumns.length - 1 ? 'border-r-2 border-border/80' : ''}`}
                          colSpan={column.count}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-semibold">{column.label}</span>
                            <span className="text-[10px] text-muted-foreground">({column.count})</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="w-32 align-middle" rowSpan={2}>{t('courses.grades.average', { defaultValue: 'Ortalama' })}</TableHead>
                    </TableRow>
                    <TableRow>
                      {gradeColumns.map((column, index) => {
                        const isActiveSort =
                          gradeSort?.type === column.type && gradeSort.itemNumber === column.itemNumber;
                        const isGroupEnd = index === gradeColumns.length - 1 || gradeColumns[index + 1]?.type !== column.type;

                        return (
                          <TableHead
                            key={`${column.type}-${column.itemNumber}`}
                            className={`w-14 p-1 text-center ${isGroupEnd ? 'border-r-2 border-border/80' : ''}`}
                          >
                            <button
                              type="button"
                              onClick={() => handleGradeSort(column.type, column.itemNumber)}
                              className={`mx-auto inline-flex h-6 min-w-8 items-center justify-center rounded px-1 text-xs font-medium transition ${
                                isActiveSort ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                              }`}
                            >
                              {column.itemNumber}
                              {isActiveSort ? (gradeSort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                            </button>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student) => {
                      const studentAverage = student.averageScore;

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.studentNumber || '-'}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{getStudentLabel(student)}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </TableCell>
                          {gradeColumns.map((column, index) => {
                            const value = student.grades.find(
                              (grade) => grade.itemType === column.type && grade.itemNumber === column.itemNumber,
                            )?.score;
                            const isGroupEnd = index === gradeColumns.length - 1 || gradeColumns[index + 1]?.type !== column.type;

                            return (
                              <TableCell
                                key={`${student.id}-${column.type}-${column.itemNumber}`}
                                className={`p-1 align-middle ${isGroupEnd ? 'border-r-2 border-border/80' : ''}`}
                              >
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  defaultValue={value ?? ''}
                                  disabled={!canEditGrades || isUpdatingGrade}
                                  onBlur={(event) => {
                                    if (!canEditGrades) {
                                      return;
                                    }

                                    const rawValue = event.currentTarget.value.trim();
                                    const normalized = rawValue === '' ? null : Number(rawValue);

                                    if (normalized !== null && Number.isNaN(normalized)) {
                                      return;
                                    }

                                    void handleUpdateGrade(student.id, column.type, column.itemNumber, normalized);
                                  }}
                                  className="h-7 min-w-12 rounded-sm border px-1 text-center text-[11px]"
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <Badge variant="outline" className={`rounded-full px-3 py-1 ${getAverageTone(studentAverage)}`}>
                              {formatScore(studentAverage)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center border-t pt-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('courses.students.previous')}
                    </Button>
                    <span className="min-w-12 text-center text-sm font-medium">{currentPage}/{totalPages}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg"
                    >
                      {t('courses.students.next')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

            </>
          )}
        </CardContent>
      </Card>

      {isDistributionOpen && distributionDraft ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-2 shadow-2xl">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {t('courses.grades.distributionTitle', { defaultValue: 'Not dağılımını düzenle' })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('courses.grades.distributionDescription', { defaultValue: 'Her not grubu için adet ve genel ortalamaya etki yüzdesini belirleyin.' })}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsDistributionOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/20 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Toplam etki</span>
                  <Badge variant={isDistributionWeightValid ? 'secondary' : 'destructive'} className="rounded-full px-3 py-1">
                    %{distributionWeightTotal}
                  </Badge>
                </div>

                <div className="grid gap-3">
                  {COURSE_GRADE_TYPES.map((entry) => {
                    const countKey = DIST_KEYS[entry.type];
                    const weightKey = WEIGHT_KEYS[entry.type];

                    return (
                      <div key={entry.type} className="grid items-center gap-3 rounded-xl border bg-muted/10 p-3 md:grid-cols-[1fr_110px_110px]">
                        <div className="text-sm font-medium">{entry.label}</div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-muted-foreground">Adet</div>
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            value={distributionDraft[countKey]}
                            onChange={(event) =>
                              setDistributionDraft((current) => {
                                if (!current) {
                                  return current;
                                }

                                const nextCount = Math.max(0, Number(event.target.value || 0));

                                return {
                                  ...current,
                                  [countKey]: nextCount,
                                  [weightKey]: nextCount === 0 ? 0 : current[weightKey],
                                };
                              })
                            }
                            className="h-9 rounded-lg border"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] text-muted-foreground">Etki (%)</div>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={distributionDraft[weightKey]}
                            disabled={distributionDraft[countKey] === 0}
                            onChange={(event) =>
                              setDistributionDraft((current) =>
                                current
                                  ? {
                                      ...current,
                                      [weightKey]: Math.max(0, Math.min(100, Number(event.target.value || 0))),
                                    }
                                  : current,
                              )
                            }
                            className="h-9 rounded-lg border"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isDistributionWeightValid ? (
                  <p className="text-sm text-destructive">Toplam etki aktif not grupları için tam %100 olmalıdır.</p>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDistributionOpen(false)}>
                  {t('common.cancel', { defaultValue: 'İptal' })}
                </Button>
                <Button onClick={handleSaveDistribution} disabled={isUpdatingDistribution || !isDistributionWeightValid}>
                  {isUpdatingDistribution ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {t('common.save', { defaultValue: 'Kaydet' })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}


    </section>
  );
};

export default CourseGradesPage;