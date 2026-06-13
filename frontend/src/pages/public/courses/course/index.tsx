import { Outlet, useParams, useNavigate, useLocation } from "react-router";
import { MockCourses } from "@/mock/courses";
import { useTranslation } from "react-i18next";
import { BookOpen, Users, Lock } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { getCurrentPath } from "@/lib/utils";
import NotFoundedPage from "@/pages/errors/not-founded";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

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
        { path: `/courses/${courseId}`, value: 'overview', label: t('courses.overview.title'), locked: false },
        { path: `/courses/${courseId}/materials`, value: 'materials', label: t('courses.materials.title'), locked: false },
        { path: `/courses/${courseId}/announcements`, value: 'announcements', label: t('announcements.list.title'), locked: false },
        { path: `/courses/${courseId}/info`, value: 'info', label: t('courses.info.title'), locked: false },
        { path: `/courses/${courseId}/grades`, value: 'grades', label: t('courses.grades.title'), locked: true },
        { path: `/courses/${courseId}/attendance`, value: 'attendance', label: t('courses.attendance.title'), locked: true },
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
        <main className="max-w-7xl mx-auto space-y-8 px-4 py-8 md:py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <PageHeader
                    variant="wide"
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
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="h-auto grid grid-cols-2 sm:grid-cols-3 lg:inline-flex lg:h-10 w-full lg:w-auto">
                        <TooltipProvider>
                            {tabs.map((tab) => (
                                tab.locked ? (
                                    <Tooltip key={tab.value}>
                                        <TooltipTrigger asChild>
                                            <TabsTrigger 
                                                value={tab.value}
                                                disabled={tab.locked}
                                                className="opacity-60 cursor-not-allowed w-full lg:w-auto"
                                            >
                                                {tab.label}
                                                <Lock className="h-3 w-3 ml-1.5" />
                                            </TabsTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('courses.grades.locked')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <TabsTrigger 
                                        key={tab.value} 
                                        value={tab.value}
                                        className="w-full lg:w-auto"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                )
                            ))}
                        </TooltipProvider>
                    </TabsList>
                    <TabsContent value={getCurrentTab()}>
                        <Outlet context={{ course }} />
                    </TabsContent>
                </Tabs>
            </motion.div>
        </main>
    );
}

export default CoursePage;