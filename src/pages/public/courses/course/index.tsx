import { Outlet, useParams, useNavigate, useLocation } from "react-router";
import { MockCourses } from "@/mock/courses";
import { useTranslation } from "react-i18next";
import { BookOpen, Users } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { getCurrentPath } from "@/lib/utils";
import NotFoundedPage from "@/pages/errors/not-founded";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoursePage = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useLanguage();
    
    const course = MockCourses.find(c => c.id === courseId);
    
    if (!course) {
        return <NotFoundedPage />;
    }

    const tabs = [
        { path: `/courses/${courseId}`, value: 'overview', label: t('courses.overview.title') },
        { path: `/courses/${courseId}/materials`, value: 'materials', label: t('courses.materials.title') },
        { path: `/courses/${courseId}/info`, value: 'info', label: t('courses.info.title') },
    ];

    const getCurrentTab = () => {
        const currentPath = getCurrentPath(location.pathname);
        const activeTab = tabs.find(tab => currentPath === tab.path);
        return activeTab?.value || 'overview';
    };

    const handleTabChange = (value: string) => {
        const tab = tabs.find(t => t.value === value);
        if (tab) {
            navigate(tab.path);
        }
    };

    const colors = {
        bgLight: `bg-${course.color}/10`,
        text: `text-${course.color}`,
    };

    return (
        <main className="min-h-screen max-w-7xl mx-auto space-y-8 px-4 py-8 md:py-10">
            <PageHeader
                variant="compact"
                title={course.code}
                description={
                    <>
                        <span className="block mb-2">{course.title[lang]}</span>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="font-medium">{course.students}</span>
                            <span>{t("home.featured.students")}</span>
                        </div>
                    </>
                }
                icon={BookOpen}
                iconBgColor={colors.bgLight}
                iconColor={colors.text}
            />
            
            <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                ))}
                </TabsList>
                <TabsContent value={getCurrentTab()}>
                    <Outlet context={{ course }} />
                </TabsContent>
            </Tabs>
        </main>
    );
}

export default CoursePage;