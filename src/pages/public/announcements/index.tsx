import { useTranslation } from "react-i18next";
import { AnnouncementCard } from "@/components/common/announcement-card";
import { AnnouncementCardSkeleton } from "@/components/common/announcement-card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Filter, Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { useAudience } from "@/providers/audience-provider";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useMemo } from "react";
import { MockCourses } from "@/mock/courses";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/page-header";

const AnnouncementsPage = () => {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const { audience } = useAudience();

    useDocumentTitle(
        t('announcements.list.title'),
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
        selectedCourses,
        dateFilter,
        activeFilterCount,
        updateSearch,
        updateShowOnlyNew,
        toggleCourse,
        updateDateFilter,
        goToNextPage,
        goToPreviousPage,
        clearAllFilters,
    } = useAnnouncements({ 
        audience,
        initialLimit: 5
    });

    // Get available courses for filters
    const availableCourses = useMemo(() => {
        const allAnnouncements = announcements;
        const courseIds = [...new Set(allAnnouncements.map(a => a.courseId))];
        return MockCourses.filter(c => courseIds.includes(c.id) && c.audience === audience);
    }, [announcements, audience]);

    const newCount = announcements.filter(a => a.isNew).length;

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
            <div className="space-y-8">
                <PageHeader
                    variant="wide"
                    title={t('announcements.list.title')}
                    description={t('announcements.list.description')}
                    icon={Bell}
                    iconBgColor="bg-chart-5/20"
                    iconColor="text-chart-5"
                    showAudienceBadge={true}
                />

                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
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
                        >
                            <Bell className="h-4 w-4" />
                            {t('announcements.new')}
                            {newCount > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {newCount}
                                </Badge>
                            )}
                        </Button>

                        {/* Course Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-xl gap-2">
                                    <Filter className="h-4 w-4" />
                                    {t('announcements.list.courses')}
                                    {selectedCourses.length > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                            {selectedCourses.length}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>{t('announcements.list.selectCourses')}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {availableCourses.map(course => (
                                    <DropdownMenuCheckboxItem
                                        key={course.id}
                                        checked={selectedCourses.includes(course.id)}
                                        onCheckedChange={() => toggleCourse(course.id)}
                                    >
                                        <span className="font-mono text-xs mr-2">{course.code}</span>
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Date Filter */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-xl gap-2">
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
                            >
                                <X className="h-4 w-4" />
                                {t('announcements.list.clearAll')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {isLoading ? t('common.pagination.loading') : `${total} ${t('announcements.list.results')}`}
                    </p>
                    {isFetching && !isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                </div>

                {/* Announcements List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <AnnouncementCardSkeleton key={index} variant="wide" />
                        ))}
                    </div>
                ) : announcements.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <AnnouncementCard
                                    key={announcement.id}
                                    id={announcement.id}
                                    courseId={announcement.courseId}
                                    title={announcement.title[lang]}
                                    description={announcement.description[lang]}
                                    date={announcement.date}
                                    isNew={announcement.isNew}
                                    variant="wide"
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4">
                                <div className="text-sm text-muted-foreground">
                                    {t('common.pagination.page', { current: currentPage + 1, total: totalPages })}
                                </div>
                                <div className="flex gap-2">
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
            </div>
        </main>
    );
}

export default AnnouncementsPage;
