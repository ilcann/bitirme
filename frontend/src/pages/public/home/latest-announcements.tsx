import { AnnouncementCard } from "@/components/common/announcement-card";
import { AnnouncementCardSkeleton } from "@/components/common/announcement-card-skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useLanguage } from "@/providers/language-provider";
import { useAnnouncements } from "@/hooks/use-announcements";

const LatestAnnouncements = () => {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const { announcements, isLoading } = useAnnouncements({ initialLimit: 3 });

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="shrink-0 p-2.5 rounded-xl bg-chart-5/10 transition-transform group-hover:scale-110">
              <Bell className="h-5 w-5 text-chart-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("home.announcements.title")}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {t("home.announcements.description")}
          </p>
        </div>
        <Button asChild variant="outline" className="hidden sm:flex rounded-xl border-2">
          <Link to="/announcements">
            {t("home.announcements.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <AnnouncementCardSkeleton key={index} />
            ))
          : announcements.map((a) => (
              <AnnouncementCard
                key={a.id}
                id={a.id}
                courseId={a.courseId}
                title={a.title[lang]}
                description={a.description[lang]}
                date={a.date}
                isNew={a.isNew}
              />
            ))}
      </div>

      <Button asChild variant="outline" className="w-full sm:hidden rounded-xl border-2">
        <Link to="/announcements">
          {t("home.announcements.viewAll")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
};

export default LatestAnnouncements;
