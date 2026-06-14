import { useMemo, useState } from 'react';
import type { CourseStudent } from '@/services/types';
import type { CourseStudentSortBy } from '@/services/types';

type SortState = {
  key: CourseStudentSortBy;
  direction: 'asc' | 'desc';
};

const STUDENTS_PER_PAGE = 10;

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('tr-Tr')
    .trim();
}

export const useCourseStudentsPagination = (students: CourseStudent[]) => {
  const [sortState, setSortState] = useState<SortState>({ key: 'name', direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate pagination values
  const totalPages = Math.ceil(sortedStudents.length / STUDENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
  const endIndex = startIndex + STUDENTS_PER_PAGE;
  const paginatedStudents = sortedStudents.slice(startIndex, endIndex);

  // Reset to page 1 when search query or sort changes
  useMemo(() => {
    setCurrentPage(1);
  }, [sortedStudents.length]);

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

  return {
    sortState,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    sortedStudents,
    paginatedStudents,
    totalPages,
    startIndex,
    endIndex,
    toggleSort,
    normalizedSearchQuery,
  };
};
