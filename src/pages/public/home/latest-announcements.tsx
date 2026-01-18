import { AnnouncementCard } from "@/components/common/announcement-card";
import { Button } from "@/components/ui/button";
import { MockAnnouncements } from "@/mock/announcements";
import { ArrowRight, Bell } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const LatestAnnouncements = () => {
  const { t } = useTranslation();

  // Get latest 3 announcements sorted by date (newest first)
  const latestAnnouncements = React.useMemo(() => {
    return [...MockAnnouncements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5 text-chart-5" />
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
        {latestAnnouncements.map((a) => (
          <AnnouncementCard
            key={a.id}
            id={a.id}
            courseId={a.courseId}
            titleKey={a.titleKey}
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
