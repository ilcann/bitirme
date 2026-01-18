import { useTranslation } from "react-i18next";
import { AnnouncementCard } from "@/components/common/announcement-card";
import { MockAnnouncements } from "@/mock/announcements";
import { MockCourses } from "@/mock/courses";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Filter, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { useAudience } from "@/providers/audience-provider";
import { useDocumentTitle } from "@/hooks/use-document-title";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

    useDocumentTitle(
        t('announcements.list.title'),
        t('announcements.list.description')
    );

    // Get unique courses from announcements, filtered by current audience
    const availableCourses = useMemo(() => {
        const courseIds = [...new Set(MockAnnouncements.map(a => a.courseId))];
        return MockCourses.filter(c => courseIds.includes(c.id) && c.audience === audience);
    }, [audience]);

    // Filter logic
    const filteredAnnouncements = useMemo(() => {
        let filtered = [...MockAnnouncements];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(a => 
                a.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.courseId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // New filter
        if (showOnlyNew) {
            filtered = filtered.filter(a => a.isNew);
        }

        // Course filter
        if (selectedCourses.length > 0) {
            filtered = filtered.filter(a => selectedCourses.includes(a.courseId));
        }

        // Audience filter (from provider)
        filtered = filtered.filter(a => a.audience === audience);

        // Date filter
        if (dateFilter !== 'all') {
            const today = new Date('2026-01-18');
            filtered = filtered.filter(a => {
                const announcementDate = new Date(a.date);
                const diffDays = Math.floor((today.getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (dateFilter === 'today') return diffDays === 0;
                if (dateFilter === 'week') return diffDays <= 7;
                if (dateFilter === 'month') return diffDays <= 30;
                return true;
            });
        }

        return filtered;
    }, [searchQuery, showOnlyNew, selectedCourses, audience, dateFilter, lang]);

    const newCount = MockAnnouncements.filter(a => a.isNew && a.audience === audience).length;
    const activeFilterCount = (showOnlyNew ? 1 : 0) + (selectedCourses.length > 0 ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0);

    const handleCourseToggle = (courseId: string) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setShowOnlyNew(false);
        setSelectedCourses([]);
        setDateFilter('all');
    };

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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 rounded-xl border-2"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {/* New Filter */}
                        <Button
                            variant={showOnlyNew ? "default" : "outline"}
                            onClick={() => setShowOnlyNew(!showOnlyNew)}
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
                                        onCheckedChange={() => handleCourseToggle(course.id)}
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
                                    onCheckedChange={() => setDateFilter('all')}
                                >
                                    {t('announcements.list.allDates')}
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={dateFilter === 'today'}
                                    onCheckedChange={() => setDateFilter('today')}
                                >
                                    {t('announcements.list.today')}
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={dateFilter === 'week'}
                                    onCheckedChange={() => setDateFilter('week')}
                                >
                                    {t('announcements.list.lastWeek')}
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    checked={dateFilter === 'month'}
                                    onCheckedChange={() => setDateFilter('month')}
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
                        {filteredAnnouncements.length} {t('announcements.list.results')}
                    </p>
                </div>

                {/* Announcements List */}
                {filteredAnnouncements.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAnnouncements.map((announcement) => (
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
