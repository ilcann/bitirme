import { useEffect, useMemo, useState } from 'react';

import type { CourseGradeStudent } from '@/services/types';

const GRADES_PER_PAGE = 5;

type SortState = {
    key: 'name' | 'studentNumber';
    direction: 'asc' | 'desc';
};

function normalizeSearchValue(value: string) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('tr-Tr')
        .trim();
}

export const useCourseGradesPagination = (students: CourseGradeStudent[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortState, setSortState] = useState<SortState>({ key: 'name', direction: 'asc' });

    const normalizedSearchQuery = useMemo(() => normalizeSearchValue(searchQuery), [searchQuery]);

    const filteredStudents = useMemo(() => {
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
    }, [students, normalizedSearchQuery, sortState.key, sortState.direction]);

    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / GRADES_PER_PAGE));
    const startIndex = (currentPage - 1) * GRADES_PER_PAGE;
    const endIndex = startIndex + GRADES_PER_PAGE;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [normalizedSearchQuery, sortState.key, sortState.direction]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return {
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        pageSize: GRADES_PER_PAGE,
        filteredStudents,
        paginatedStudents,
        totalPages,
        startIndex,
        endIndex,
        normalizedSearchQuery,
        sortState,
        setSortState,
    };
};
