import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowUpDown, Check, ChevronLeft, ChevronRight, FileDown, Loader2, LogIn, Search, Users, X } from 'lucide-react';

import { useAuth } from '@/providers/auth-provider';
import NotFoundedPage from '@/pages/errors/not-founded';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { useCourseAttendance } from '@/hooks/use-course-attendance';
import { useCourseAttendancePagination } from '@/hooks/use-course-attendance-pagination';
import { exportTablePdf } from '@/lib/export-pdf';
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
import type { CourseAttendanceStudent, CourseAttendanceWeekStatus } from '@/services/types';
import type { Course } from '@/types/course';

const WEEK_COUNT_FALLBACK = 14;

function getWeekRateColor(presentRate: number) {
  if (presentRate >= 75) {
    return 'bg-emerald-500';
  }

  if (presentRate >= 50) {
    return 'bg-amber-500';
  }

  return 'bg-rose-500';
}

function AttendanceProgress({ student, weekCount }: { student: CourseAttendanceStudent; weekCount: number }) {
  const presentRate = Math.min(100, Math.max(0, student.presentRate));

  return (
    <div className="space-y-2 min-w-44">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{student.markedCount}/{weekCount}</span>
        <span>{presentRate.toFixed(1)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${getWeekRateColor(presentRate)}`}
          style={{ width: `${presentRate}%` }}
        />
      </div>
    </div>
  );
}

function WeekStatusButton({
  status,
  editable,
  isUpdating,
  onSetStatus,
}: {
  status: CourseAttendanceWeekStatus;
  editable: boolean;
  isUpdating: boolean;
  onSetStatus: (isPresent: boolean) => void;
}) {
  const presentActive = status === true;
  const absentActive = status === false;
  const nextStatus = presentActive ? false : true;
  const label = presentActive ? 'Var' : absentActive ? 'Yok' : '-';
  const className = presentActive
    ? 'border-emerald-600 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600 hover:text-white'
    : absentActive
      ? 'border-rose-600 bg-rose-600/10 text-rose-700 hover:bg-rose-600 hover:text-white'
      : 'border-muted-foreground/30 bg-muted/40 text-muted-foreground hover:bg-muted';

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={!editable || isUpdating}
      onClick={() => onSetStatus(nextStatus)}
      className={`h-8 min-w-20 rounded-full gap-1.5 border ${className}`}
      aria-label={label}
    >
      {presentActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

function WeekStatusPill({ status }: { status: CourseAttendanceWeekStatus }) {
  const presentActive = status === true;
  const absentActive = status === false;

  return (
    <div className="flex justify-center">
      <div
        className={presentActive
          ? 'inline-flex h-8 min-w-16 items-center justify-center gap-1 rounded-full border border-emerald-600 bg-emerald-600/10 px-3 text-xs font-medium text-emerald-700'
          : absentActive
            ? 'inline-flex h-8 min-w-16 items-center justify-center gap-1 rounded-full border border-rose-600 bg-rose-600/10 px-3 text-xs font-medium text-rose-700'
            : 'inline-flex h-8 min-w-16 items-center justify-center gap-1 rounded-full border border-muted-foreground/30 bg-muted/40 px-3 text-xs font-medium text-muted-foreground'}
      >
        {presentActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        <span>{presentActive ? 'Var' : absentActive ? 'Yok' : '-'}</span>
      </div>
    </div>
  );
}

function StudentAttendanceCard({
  student,
  weekLabel,
  presentRateLabel,
  absentLabel,
}: {
  student: CourseAttendanceStudent;
  weekLabel: string;
  presentRateLabel: string;
  absentLabel: string;
}) {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold tracking-tight">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {student.studentNumber || '-'} · {student.email}
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
            {student.presentRate.toFixed(1)}% {presentRateLabel}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-end text-sm text-muted-foreground">
            <span>{absentLabel.replace('__COUNT__', String(student.absentCount))}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${getWeekRateColor(student.presentRate)}`}
              style={{ width: `${Math.min(100, Math.max(0, student.presentRate))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-14">
          {student.weeks.map((week) => (
            <div key={week.weekNumber} className="rounded-2xl border bg-muted/20 p-2 text-center">
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {weekLabel.replace('{{week}}', String(week.weekNumber))}
              </div>
              <WeekStatusPill status={week.isPresent} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const CourseAttendancePage = () => {
  const { t } = useTranslation('courses');
  const { user, openLogin } = useAuth();
  const { course } = useOutletContext<{ course: Course }>();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';

  useDocumentTitle(
    `${course?.code} - ${t('courses.attendance.title')}`,
    t('courses.attendance.description')
  );

  const {
    attendance,
    total,
    weekCount,
    isLoading,
    isFetching,
    isUpdating,
    error,
    updateAttendance,
  } = useCourseAttendance(course?.id, Boolean(user));

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    filteredStudents,
    paginatedStudents,
    totalPages,
    normalizedSearchQuery,
    sortState,
    setSortState,
  } = useCourseAttendancePagination(attendance);

  const weekNumbers = useMemo(() => {
    const resolvedWeekCount = weekCount || WEEK_COUNT_FALLBACK;

    return Array.from({ length: resolvedWeekCount }, (_, index) => index + 1);
  }, [weekCount]);

  const attendanceWeekLabel = t('courses.attendance.weekLabel', { week: '{{week}}' });
  const attendancePresentRateLabel = t('courses.attendance.summary.presentRate');
  const attendanceAbsentLabel = t('courses.attendance.summary.absent', {
    count: '__COUNT__',
  } as Record<string, string>) as string;
  const attendanceSortNameLabel = t('courses.students.table.name');
  const attendanceSortStudentNumberLabel = t('courses.students.table.studentNumber');
  const attendanceSortAscendingLabel = t('courses.students.sort.asc');
  const attendanceSortDescendingLabel = t('courses.students.sort.desc');

  const handleUpdateAttendance = async (studentId: number, weekNumber: number, isPresent: boolean) => {
    if (!course?.id || !canEdit) {
      return;
    }

    await updateAttendance({
      courseId: course.id,
      studentId,
      weekNumber,
      isPresent,
    });
  };

  const handleExportAttendancePdf = () => {
    if (!canEdit || !course || filteredStudents.length === 0) {
      return;
    }

    const head = [
      t('courses.attendance.table.studentNumber'),
      t('courses.attendance.table.name'),
      'Email',
      t('courses.attendance.summary.presentRate'),
      t('courses.attendance.table.absent', { defaultValue: 'Devamsizlik' }),
      ...weekNumbers.map((weekNumber) => t('courses.attendance.weekLabel', { week: weekNumber })),
    ];

    const body = filteredStudents.map((student) => [
      student.studentNumber || '-',
      `${student.firstName} ${student.lastName}`,
      student.email,
      `${student.presentRate.toFixed(1)}%`,
      String(student.absentCount),
      ...weekNumbers.map((weekNumber) => {
        const week = student.weeks[weekNumber - 1];
        if (!week) {
          return '-';
        }

        return week.isPresent === true ? 'Var' : week.isPresent === false ? 'Yok' : '-';
      }),
    ]);

    void exportTablePdf({
      title: `${course.code} - ${t('courses.attendance.title')}`,
      fileName: `${course.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-attendance.pdf`,
      head,
      body,
      orientation: 'landscape',
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
              <h3 className="text-xl font-semibold">{t('courses.attendance.loginRequiredTitle')}</h3>
              <p className="max-w-lg text-sm text-muted-foreground">
                {t('courses.attendance.loginRequiredDescription')}
              </p>
            </div>
            <Button onClick={openLogin} className="rounded-full">
              {t('courses.attendance.loginRequiredAction')}
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!course) {
    return <NotFoundedPage />;
  }

  if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR' && user.role !== 'STUDENT') {
    return <NotFoundedPage />;
  }

  const studentRows = filteredStudents;
  const ownAttendance = user.role === 'STUDENT'
    ? attendance.find((student) => student.id === user.id) ?? null
    : (attendance[0] ?? null);
  const hasRows = ownAttendance !== null;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            {t('courses.attendance.loading')}
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <Card className="border-2 border-destructive/30">
          <CardContent className="space-y-3 py-10 text-center">
            <h3 className="text-lg font-semibold">{t('courses.attendance.errorTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('courses.attendance.errorDescription')}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t('courses.attendance.retry')}
            </Button>
          </CardContent>
        </Card>
      </section>
    );
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
          <h2 className="text-2xl font-semibold tracking-tight">{t('courses.attendance.title')}</h2>
          {canEdit ? <p className="text-sm text-muted-foreground">{t('courses.attendance.description')}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canEdit ? (
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
              <Users className="mr-1.5 h-4 w-4" />
              {total} {t('courses.students.count')}
            </Badge>
          ) : null}
          <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium">
            {weekNumbers.length} {t('courses.attendance.weekCount')}
          </Badge>
          {canEdit ? (
            <Button
              variant="outline"
              className="rounded-full"
              onClick={handleExportAttendancePdf}
              disabled={filteredStudents.length === 0 || isLoading}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {t('courses.attendance.exportPdf', { defaultValue: 'PDF disa aktar' })}
            </Button>
          ) : null}
          {canEdit ? (
            <Badge className="rounded-full px-3 py-1 text-sm font-medium">
              {t('courses.attendance.editMode')}
            </Badge>
          ) : null}
        </div>
      </motion.div>

      {!canEdit ? (
        hasRows ? (
          <StudentAttendanceCard
            student={ownAttendance as CourseAttendanceStudent}
            weekLabel={attendanceWeekLabel}
            presentRateLabel={attendancePresentRateLabel}
            absentLabel={attendanceAbsentLabel}
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{t('courses.attendance.emptyTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('courses.attendance.emptyDescription')}</p>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t('courses.attendance.search.placeholder')}
                  className="h-11 rounded-xl border-2 pl-10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{t('courses.attendance.search.help')}</span>
                {isFetching && !isLoading ? <span>• {t('courses.attendance.loading')}</span> : null}
                {isUpdating ? <span>• {t('courses.attendance.saving')}</span> : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('courses.attendance.sortingHint')}</span>
              <Button
                variant={sortState.key === 'name' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setSortState((current) => ({
                  key: 'name',
                  direction: current.key === 'name' && current.direction === 'asc' ? 'desc' : 'asc',
                }))}
              >
                {attendanceSortNameLabel}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                <span className="sr-only">
                  {sortState.key === 'name' && sortState.direction === 'asc' ? attendanceSortAscendingLabel : attendanceSortDescendingLabel}
                </span>
              </Button>
              <Button
                variant={sortState.key === 'studentNumber' ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setSortState((current) => ({
                  key: 'studentNumber',
                  direction: current.key === 'studentNumber' && current.direction === 'asc' ? 'desc' : 'asc',
                }))}
              >
                {attendanceSortStudentNumberLabel}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                <span className="sr-only">
                  {sortState.key === 'studentNumber' && sortState.direction === 'asc' ? attendanceSortAscendingLabel : attendanceSortDescendingLabel}
                </span>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {normalizedSearchQuery ? t('courses.attendance.search.results', { count: filteredStudents.length }) : t('courses.attendance.search.results', { count: total })}
              </span>
            </div>

            {studentRows.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  {normalizedSearchQuery ? t('courses.attendance.emptySearchTitle') : t('courses.attendance.emptyTitle')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {normalizedSearchQuery ? t('courses.attendance.emptySearchDescription') : t('courses.attendance.emptyDescription')}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-28">{t('courses.attendance.table.studentNumber')}</TableHead>
                        <TableHead className="w-56">{t('courses.attendance.table.name')}</TableHead>
                        <TableHead className="w-56 text-center">{t('courses.attendance.table.progress')}</TableHead>
                        {weekNumbers.map((weekNumber) => (
                          <TableHead key={weekNumber} className="min-w-24 text-center">
                            {t('courses.attendance.weekLabel', { week: weekNumber })}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.studentNumber || '-'}</TableCell>
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="font-medium">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="px-3">
                            <AttendanceProgress student={student} weekCount={weekNumbers.length} />
                          </TableCell>
                          {weekNumbers.map((weekNumber) => {
                            const week = student.weeks[weekNumber - 1];

                            return (
                              <TableCell key={weekNumber} className="px-2 text-center">
                                <WeekStatusButton
                                  status={week ? week.isPresent : null}
                                  editable={canEdit}
                                  isUpdating={isUpdating}
                                  onSetStatus={(isPresent) => handleUpdateAttendance(student.id, weekNumber, isPresent)}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
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
                        disabled={currentPage === 1 || isUpdating}
                        className="rounded-lg"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        {t('courses.students.previous')}
                      </Button>
                      <span className="min-w-12 text-center text-sm font-medium">
                        {currentPage}/{totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages || isUpdating}
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
      )}
    </section>
  );
};

export default CourseAttendancePage;