import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router";
import { MockAnnouncements } from "@/mock/announcements";
import { MockCourses } from "@/mock/courses";
import { useLanguage } from "@/providers/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Clock, BookOpen, ArrowLeft } from "lucide-react";
import NotFoundedPage from "@/pages/errors/not-founded";
import { motion } from "framer-motion";
import { formatRelativeDate } from "@/lib/date";

const AnnouncementsDetailPage = () => {
    const { t } = useTranslation();
    const { announcementId } = useParams();
    const { lang } = useLanguage();

    const announcement = MockAnnouncements.find(a => a.id === announcementId);
    const course = announcement ? MockCourses.find(c => c.id === announcement.courseId) : null;

    useDocumentTitle(
        announcement ? announcement.title[lang] : t('announcements.detail.title'),
        announcement ? announcement.description[lang] : t('announcements.detail.description')
    );

    if (!announcement) {
        return <NotFoundedPage />;
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
            <div className="space-y-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Button variant="ghost" asChild className="gap-2">
                        <Link to="/announcements">
                            <ArrowLeft className="h-4 w-4" />
                            {t('common.back')}
                        </Link>
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <motion.article 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-2">
                            <CardHeader className="pb-4">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0 p-3 rounded-xl bg-chart-5/20">
                                        <Bell className="h-6 w-6 text-chart-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {announcement.isNew && (
                                                <Badge variant="default" className="bg-chart-5 hover:bg-chart-5/90">
                                                    {t('announcements.new')}
                                                </Badge>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {formatRelativeDate(announcement.date, lang)}
                                            </span>
                                        </div>
                                        <CardTitle className="text-2xl md:text-3xl leading-tight">
                                            {announcement.title[lang]}
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    <p className="text-base leading-relaxed text-muted-foreground">
                                        {announcement.description[lang]}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.article>

                    {/* Sidebar */}
                    <motion.aside 
                        className="lg:col-span-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="border-2 sticky top-24">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base">{t('announcements.detail.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Date */}
                                <div className="flex items-center gap-3 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{announcement.date}</span>
                                </div>

                                {/* Course */}
                                {course && (
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        <Link 
                                            to={`/courses/${course.id}`} 
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                        >
                                            {course.code} - {course.title[lang]}
                                        </Link>
                                    </div>
                                )}

                                {/* Audience */}
                                <div className="pt-2 border-t">
                                    <Badge variant="outline" className="text-xs">
                                        {announcement.audience === 'common' 
                                            ? t('announcements.list.allAudiences') 
                                            : t('audiences.department')
                                        }
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.aside>
                </div>
            </div>
        </main>
    );
}

export default AnnouncementsDetailPage;