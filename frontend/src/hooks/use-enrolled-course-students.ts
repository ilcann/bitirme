import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getEnrolledCourseStudents } from '@/services/courses.service';

type UseEnrolledCourseStudentsOptions = {
  courseId?: string;
  initialLimit?: number;
  initialSearch?: string;
};

export const useEnrolledCourseStudents = ({
  courseId,
  initialLimit = 5,
  initialSearch = '',
}: UseEnrolledCourseStudentsOptions) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [limit] = useState(initialLimit);

  const queryParams = useMemo(() => ({
    courseId: courseId || '',
    limit,
    search: searchQuery || undefined,
  }), [courseId, limit, searchQuery]);

  const { data, isLoading, isFetching, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['enrolled-course-students', queryParams],
    queryFn: ({ pageParam = 0 }) => getEnrolledCourseStudents({
      ...queryParams,
      offset: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      return lastPage.offset + lastPage.limit;
    },
    enabled: Boolean(courseId),
    staleTime: 2 * 60 * 1000,
  });

  const pages = data?.pages ?? [];
  const students = pages.flatMap((page) => page.data);
  const total = pages[0]?.total ?? 0;

  const updateSearch = (value: string) => {
    setSearchQuery(value);
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const resetPagination = () => {
    setSearchQuery('');
  };

  return {
    students,
    total,
    limit,
    hasNextPage: Boolean(hasNextPage),
    searchQuery,
    isLoading,
    isFetching,
    isFetchingNextPage,
    error,
    updateSearch,
    loadMore,
    resetPagination,
    refetch,
  };
};

export default useEnrolledCourseStudents;
