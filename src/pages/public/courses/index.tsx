import { CourseCard } from "@/components/common/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MockCourses } from "@/mock/courses";
import { useAudience } from "@/providers/audience-provider";
import { useLanguage } from "@/providers/language-provider";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { BookOpen, Filter, Search } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/common/page-header";

const CoursesPage = () => {
  const { lang } = useLanguage();
  const { t } = useTranslation();
  const { audience } = useAudience();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"compact" | "wide">("compact");

  useDocumentTitle(
    t('courses.list.title'),
    t('courses.list.description')
  );

  // Filter courses by audience and search query
  const filteredCourses = React.useMemo(() => {
    return MockCourses
      .filter(course => course.audience === audience)
      .filter(course => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          course.code.toLowerCase().includes(query) ||
          course.title[lang].toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.students - a.students);
  }, [audience, searchQuery, lang]);
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
      <div className="space-y-8">
        <PageHeader
          variant="wide"
          title={t("courses.list.title")}
          description={t("courses.list.description")}
          icon={BookOpen}
          iconBgColor="bg-chart-1/20"
          iconColor="text-chart-1"
          showAudienceBadge={true}
        />

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("home.search.placeholder")}
              className="pl-10 h-11 rounded-xl border-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "compact" ? "default" : "outline"}
              onClick={() => setViewMode("compact")}
              className="rounded-xl"
            >
              {t("courses.list.view.compact")}
            </Button>
            <Button
              variant={viewMode === "wide" ? "default" : "outline"}
              onClick={() => setViewMode("wide")}
              className="rounded-xl"
            >
              {t("courses.list.view.wide")}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length} {t("courses.list.resultsFound")}
          </p>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div className={
            viewMode === "compact"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                code={course.code}
                title={course.title[lang]}
                students={course.students}
                color={course.color}
                variant={viewMode}
              />
            ))}
          </div>
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