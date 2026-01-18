import { CourseCard } from "@/components/common/course-card";
import { Button } from "@/components/ui/button";
import { MockCourses } from "@/mock/courses";
import { useAudience } from "@/providers/audience-provider";
import { ArrowRight, TrendingUp } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const FeaturedCourses = () => {
  const { t } = useTranslation();
  const { audience } = useAudience();

  const featuredCourses = React.useMemo(() => {
    return MockCourses
      .filter(course => course.audience === audience)
      .sort((a, b) => b.students - a.students)
      .slice(0, 3);
  }, [audience]);

  const wideCourses = React.useMemo(() => {
    return MockCourses
      .filter(course => course.audience === audience)
      .sort((a, b) => b.students - a.students)
      .slice(3, 5);
  }, [audience]);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`shrink-0 p-2.5 rounded-xl bg-chart-3/10 transition-transform group-hover:scale-110`}>
                <TrendingUp className={`h-5 w-5 text-chart-3`} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("home.featured.title")}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t(`home.featured.description.${audience}`)}
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex rounded-xl border-2">
          <Link to="/courses">
            {t("home.featured.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCourses.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            code={course.code}
            titleKey={course.titleKey}
            students={course.students}
            color={course.color}
            variant="compact"
          />
        ))}
      </div>

      {/* Wide Cards */}
      {wideCourses.length > 0 && (
        <div className="space-y-4">
          {wideCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              code={course.code}
              titleKey={course.titleKey}
              students={course.students}
              color={course.color}
              variant="wide"
            />
          ))}
        </div>
      )}

      <Button asChild variant="outline" className="w-full sm:hidden rounded-xl border-2">
        <Link to="/courses">
          {t("home.featured.viewAll")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
};

export default FeaturedCourses;
