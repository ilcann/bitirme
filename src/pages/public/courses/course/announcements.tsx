import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useOutletContext } from "react-router";
import { useAudience } from "@/providers/audience-provider";
import { useLanguage } from "@/providers/language-provider";
import { AnnouncementCard } from "@/components/common/announcement-card";
import { AnnouncementCardSkeleton } from "@/components/common/announcement-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    Bell,
    Calendar,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { Course } from "@/types/course";

const CourseAnnouncementsPage = () => {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const { audience } = useAudience();
    const { course } = useOutletContext<{ course: Course }>();

    useDocumentTitle(
        `${course?.code} - ${t('announcements.list.title')}`,
        t('announcements.list.description')
    );

    const {
        announcements,
        total,
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        isLoading,
        isFetching,
        searchQuery,
        showOnlyNew,
        dateFilter,
        activeFilterCount,
        updateSearch,
        updateShowOnlyNew,
        updateDateFilter,
        goToNextPage,
        goToPreviousPage,
        clearAllFilters,
    } = useAnnouncements({
        audience,
        initialLimit: 5,
        courseId: course?.id,
    });

    const newCount = announcements.filter(a => a.isNew).length;

    return (
        <section className="space-y-6">
            {/* Search & Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder={t('announcements.list.search')}
                        value={searchQuery}
                        onChange={(e) => updateSearch(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-2"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {/* New Filter */}
                    <Button
                        variant={showOnlyNew ? "default" : "outline"}
                        onClick={() => updateShowOnlyNew(!showOnlyNew)}
                        className="rounded-xl gap-2"
                        size="sm"
                    >
                        <Bell className="h-4 w-4" />
                        {t('announcements.new')}
                        {newCount > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {newCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Date Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl gap-2" size="sm">
                                <Calendar className="h-4 w-4" />
                                {t('announcements.list.date')}
                                {dateFilter !== 'all' && (
                                    <Badge variant="secondary" className="ml-1">1</Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>{t('announcements.list.selectDate')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === 'all'}
                                onCheckedChange={() => updateDateFilter('all')}
                            >
                                {t('announcements.list.allDates')}
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === 'today'}
                                onCheckedChange={() => updateDateFilter('today')}
                            >
                                {t('announcements.list.today')}
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === 'week'}
                                onCheckedChange={() => updateDateFilter('week')}
                            >
                                {t('announcements.list.lastWeek')}
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dateFilter === 'month'}
                                onCheckedChange={() => updateDateFilter('month')}
                            >
                                {t('announcements.list.lastMonth')}
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear All */}
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            onClick={clearAllFilters}
                            className="rounded-xl gap-2"
                            size="sm"
                        >
                            <X className="h-4 w-4" />
                            {t('announcements.list.clearAll')}
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Results Count & Pagination Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? t('common.pagination.loading') : `${total} ${t('announcements.list.results')}`}
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

            {/* Announcements List */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <AnnouncementCardSkeleton key={index} variant="wide" />
                    ))}
                </div>
            ) : announcements.length > 0 ? (
                <>
                    <motion.div
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.08
                                }
                            }
                        }}
                    >
                        {announcements.map((announcement) => (
                            <motion.div
                                key={announcement.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <AnnouncementCard
                                    id={announcement.id}
                                    courseId={announcement.courseId}
                                    title={announcement.title[lang]}
                                    description={announcement.description[lang]}
                                    date={announcement.date}
                                    isNew={announcement.isNew}
                                    variant="wide"
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
                                onClick={goToPreviousPage}
                                disabled={!hasPreviousPage || isFetching}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                {t('common.pagination.previous')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextPage}
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
                        <Bell className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t('announcements.list.noResults.title')}</h3>
                    <p className="text-muted-foreground max-w-md">
                        {t('announcements.list.noResults.description')}
                    </p>
                </div>
            )}
        </section>
    );
}

export default CourseAnnouncementsPage;
