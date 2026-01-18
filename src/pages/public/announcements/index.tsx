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
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const AnnouncementsPage = () => {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const { audience } = useAudience();
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnlyNew, setShowOnlyNew] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

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

    const newCount = MockAnnouncements.filter(a => a.isNew).length;
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
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10 space-y-8">
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

                {/* Search and Filters */}
                <div className="space-y-4 pt-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('announcements.list.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-9"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Stats Badges */}
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="px-3 py-1 text-sm">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                {filteredAnnouncements.length} {t('announcements.list.results')}
                            </Badge>
                            {newCount > 0 && (
                                <Badge className="px-3 py-1 text-sm bg-chart-5 hover:bg-chart-5">
                                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                                    {newCount} {t('announcements.new')}
                                </Badge>
                            )}
                        </div>

                        <div className="flex-1" />

                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            {/* New Filter */}
                            <Button
                                variant={showOnlyNew ? "default" : "outline"}
                                size="sm"
                                onClick={() => setShowOnlyNew(!showOnlyNew)}
                                className="gap-2"
                            >
                                <Bell className="h-4 w-4" />
                                {t('announcements.new')}
                            </Button>

                            {/* Course Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
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
                                            <span className="text-xs truncate">{course.title[lang]}</span>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Date Filter */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
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
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    {t('announcements.list.clearAll')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements List */}
            {filteredAnnouncements.length > 0 ? (
                <div className="space-y-3">
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
        </main>
    );
}

export default AnnouncementsPage;
