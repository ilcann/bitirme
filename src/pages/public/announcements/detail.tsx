import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router";
import { MockAnnouncements } from "@/mock/announcements";
import { useLanguage } from "@/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import NotFoundedPage from "@/pages/errors/not-founded";

const AnnouncementsDetailPage = () => {
    const { t } = useTranslation('announcements');
    const { announcementId } = useParams();
    const { lang } = useLanguage();

    const announcement = MockAnnouncements.find(a => a.id === announcementId);

    useDocumentTitle(
        announcement ? announcement.title[lang] : t('detail.title'),
        announcement ? announcement.description[lang] : t('detail.description')
    );

    if (!announcement) {
        return <NotFoundedPage />;
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <article className="lg:col-span-2">
                    <div className="space-y-6">
                        <h1 className="text-2xl md:text-3xl font-bold">{announcement.title[lang]}</h1>
                        <div className="prose max-w-none text-muted-foreground">
                            <p>{announcement.description[lang]}</p>
                        </div>
                    </div>
                </article>

                {/* Right-side info on desktop, top on mobile */}
                <aside className="order-first lg:order-0 lg:col-span-1">
                    <div className="space-y-4 p-4 rounded-xl border-2 bg-card">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{t('announcements.detail.title')}</h4>
                            {announcement.isNew && <Badge variant="secondary">{t('announcements.new')}</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{announcement.date}</span>
                            </div>
                            <div className="mt-2">
                                <Link to={`/courses/${announcement.courseId}`} className="text-sm underline">{announcement.courseId}</Link>
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                                {announcement.audience === 'common' ? t('announcements.list.allAudiences') : t('announcements.list.courses')}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

export default AnnouncementsDetailPage;