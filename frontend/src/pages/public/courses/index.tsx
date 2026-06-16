import { CourseCard } from "@/components/common/course-card";
import { CourseCardSkeleton } from "@/components/common/course-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAudience } from "@/providers/audience-provider";
import { useLanguage } from "@/providers/language-provider";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useCourses } from "@/hooks/use-courses";
import { BookOpen, Search, ChevronLeft, ChevronRight, Loader2, ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { PageHeader } from "@/components/common/page-header";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { CourseCreateModal } from "@/components/common/course-create-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CoursesPage = () => {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const { audience } = useAudience();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  useDocumentTitle(
    t('courses.list.title'),
    t('courses.list.description')
  );

  const {
    courses,
    total,
    isLoading,
    isFetching,
    searchQuery,
    sortBy,
    updateSearch,
    updateSortBy,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
  } = useCourses({
    audience,
    initialLimit: 9,
    initialSearch: initialQuery
  });

  const handleNextPage = () => {
    goToNextPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <PageHeader
              variant="wide"
              title={t("courses.list.title")}
              description={t("courses.list.description")}
              icon={BookOpen}
              iconBgColor="bg-chart-1/20"
              iconColor="text-chart-1"
              showAudienceBadge={true}
              className="flex-1"
            />

            {user?.role === 'ADMIN' ? (
              <div className="lg:pt-1 lg:self-start">
                <CourseCreateModal triggerClassName="w-full lg:w-auto" />
              </div>
            ) : null}
          </div>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder={t("home.search.placeholder")}
              className="pl-10 h-11 rounded-xl border-2"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {t("courses.list.sort.by")}: {t(`courses.list.sort.options.${sortBy}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateSortBy("students")}>
                  {t("courses.list.sort.options.students")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy("code")}>
                  {t("courses.list.sort.options.code")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateSortBy("title")}>
                  {t("courses.list.sort.options.title")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        </motion.div>

        {/* Results Count & Pagination Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? t('common.pagination.loading') : `${total} ${t("courses.list.resultsFound")}`}
          </p>
          <div className="flex items-center gap-3">
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                {t('common.pagination.page', { current: currentPage + 1, total: totalPages })}
              </p>
            )}
            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </div>
        </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <CourseCardSkeleton key={index} variant="compact" />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <>
            <motion.div
              key={`${searchQuery}-${currentPage}`}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {courses.map((course,) => (
                <motion.div
                  key={course.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CourseCard
                    id={course.id}
                    code={course.code}
                    title={course.title[lang]}
                    students={course.students}
                    color={course.color}
                    variant="compact"
                    canDelete={user?.role === 'ADMIN'}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || isFetching}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('common.pagination.previous')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || isFetching}
                >
                  {t('common.pagination.next')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("courses.list.noResults.title")}</h3>
            <p className="text-muted-foreground max-w-md">
              {t("courses.list.noResults.description")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default CoursesPage;