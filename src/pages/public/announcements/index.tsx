import { useTranslation } from "react-i18next";
import { AnnouncementCard } from "@/components/common/announcement-card";
import { MockAnnouncements } from "@/mock/announcements";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

const AnnouncementsPage = () => {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const [showOnlyNew, setShowOnlyNew] = useState(false);

    const filteredAnnouncements = showOnlyNew 
        ? MockAnnouncements.filter(a => a.isNew)
        : MockAnnouncements;

    const newCount = MockAnnouncements.filter(a => a.isNew).length;

    return (
       <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10 space-y-16">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-chart-5/10">
                            <Bell className="h-8 w-8 text-chart-5" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">{t('announcements.list.title')}</h1>
                            <p className="text-muted-foreground text-lg">{t('announcements.list.description')}</p>
                        </div>
                    </div>

                    {/* Stats and Filter */}
                    <div className="flex flex-wrap items-center gap-3 pt-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="px-3 py-1 text-sm">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                {filteredAnnouncements.length} {t('announcements.list.title')}
                            </Badge>
                            {newCount > 0 && (
                                <Badge className="px-3 py-1 text-sm bg-chart-5 hover:bg-chart-5">
                                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                                    {newCount} {t('announcements.new')}
                                </Badge>
                            )}
                        </div>

                        <div className="ml-auto">
                            <Button
                                variant={showOnlyNew ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowOnlyNew(!showOnlyNew)}
                                className="gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                {showOnlyNew ? t('announcements.new') : t('announcements.list.showAll')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Announcements Grid */}
                {filteredAnnouncements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAnnouncements.map((announcement) => (
                            <AnnouncementCard
                                key={announcement.id}
                                id={announcement.id}
                                courseId={announcement.courseId}
                                title={announcement.title[lang]}
                                date={announcement.date}
                                isNew={announcement.isNew}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 space-y-4">
                        <div className="inline-flex p-6 rounded-full bg-muted/50">
                            <Bell className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{t('announcements.list.noResults.title')}</h3>
                            <p className="text-muted-foreground">{t('announcements.list.noResults.description')}</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default AnnouncementsPage;