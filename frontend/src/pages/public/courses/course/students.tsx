import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpDown, Search, Users } from "lucide-react";

import { useDocumentTitle } from "@/hooks/use-document-title";
import { useCourseStudents } from "@/hooks/use-course-students";
import { useAuth } from "@/providers/auth-provider";
import NotFoundedPage from "@/pages/errors/not-founded";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import CourseEnrollStudentsModal from "@/components/common/course-enroll-students-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CourseStudentSortBy } from "@/services/types";
import type { Course } from "@/types/course";

type SortState = {
  key: CourseStudentSortBy;
  direction: "asc" | "desc";
};

const CourseStudentsPage = () => {
  const { t } = useTranslation('courses');
  const { user } = useAuth();
  const { course } = useOutletContext<{ course: Course }>();
  const [sortState, setSortState] = useState<SortState>({ key: 'name', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const canViewStudents = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR';

  useDocumentTitle(
    `${course?.code} - ${t('courses.students.title')}`,
    t('courses.students.description')
  );

  const { students, total, isLoading, isFetching } = useCourseStudents(course?.id, sortState.key, canViewStudents);

  const normalizedSearchQuery = useMemo(() => normalizeSearchValue(searchQuery), [searchQuery]);

  const sortedStudents = useMemo(() => {
    const items = students.filter((student) => {
      if (!normalizedSearchQuery) {
        return true;
      }

      const searchableValue = normalizeSearchValue([
        student.studentNumber || '',
        student.firstName,
        student.lastName,
        student.email,
      ].join(' '));

      return searchableValue.includes(normalizedSearchQuery);
    });

    items.sort((left, right) => {
      if (sortState.key === 'studentNumber') {
        const leftNumber = left.studentNumber || '';
        const rightNumber = right.studentNumber || '';
        return leftNumber.localeCompare(rightNumber, 'tr', { numeric: true, sensitivity: 'base' });
      }

      const leftName = `${left.firstName} ${left.lastName}`;
      const rightName = `${right.firstName} ${right.lastName}`;
      return leftName.localeCompare(rightName, 'tr', { sensitivity: 'base' });
    });

    if (sortState.direction === 'desc') {
      items.reverse();
    }

    return items;
  }, [students, sortState, normalizedSearchQuery]);

  const toggleSort = (key: CourseStudentSortBy) => {
    setSortState((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        key,
        direction: 'asc',
      };
    });
  };

  const sortLabel = sortState.direction === 'asc'
    ? t('courses.students.sort.asc')
    : t('courses.students.sort.desc');
  const courseStudentTitle = t('courses.students.title');
  const courseStudentDescription = t('courses.students.description');
  const courseStudentCount = t('courses.students.count');
  const courseStudentLoading = t('courses.students.loading');
  const courseStudentSortingHint = t('courses.students.sortingHint', { sortLabel });
  const courseStudentEmptyTitle = t('courses.students.empty.title');
  const courseStudentEmptyDescription = t('courses.students.empty.description');
  const courseStudentNumberLabel = t('courses.students.table.studentNumber');
  const courseStudentNameLabel = t('courses.students.table.name');
  const courseStudentEmailLabel = t('courses.students.table.email');
  const courseStudentEnrolledAtLabel = t('courses.students.table.enrolledAt');
  const courseStudentSearchPlaceholder = t('courses.students.search.placeholder');
  const courseStudentSearchHelp = t('courses.students.search.help');
  const activeSearchCount = normalizedSearchQuery ? sortedStudents.length : total;
  const activeSearchCountLabel = t('courses.students.search.results', { count: activeSearchCount });

  if (!canViewStudents) {
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
          <h2 className="text-2xl font-semibold tracking-tight">{courseStudentTitle}</h2>
          <p className="text-sm text-muted-foreground">{courseStudentDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
            <Users className="mr-1.5 h-4 w-4" />
            {total} {courseStudentCount}
          </Badge>
          {normalizedSearchQuery ? (
            <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium">
              {activeSearchCountLabel}
            </Badge>
          ) : null}
          <CourseEnrollStudentsModal courseId={course?.id} />
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
                placeholder={courseStudentSearchPlaceholder}
                className="h-11 rounded-xl border-2 pl-10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{courseStudentSearchHelp}</span>
              {isFetching && !isLoading ? <span>• {courseStudentLoading}</span> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{courseStudentSortingHint}</span>
            <Button
              variant={sortState.key === 'name' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => toggleSort('name')}
            >
              {courseStudentNameLabel}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant={sortState.key === 'studentNumber' ? 'default' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => toggleSort('studentNumber')}
            >
              {courseStudentNumberLabel}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              {courseStudentLoading}
            </div>
          ) : sortedStudents.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">
                {normalizedSearchQuery ? t('courses.students.empty.searchTitle') : courseStudentEmptyTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {normalizedSearchQuery ? t('courses.students.empty.searchDescription') : courseStudentEmptyDescription}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-30">
                    {courseStudentNumberLabel}
                  </TableHead>
                  <TableHead>
                    {courseStudentNameLabel}
                  </TableHead>
                  <TableHead>{courseStudentEmailLabel}</TableHead>
                  <TableHead className="w-40">{courseStudentEnrolledAtLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.studentNumber || '-'}
                    </TableCell>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrolledAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('tr-Tr')
    .trim();
}

export default CourseStudentsPage;