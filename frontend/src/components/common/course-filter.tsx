import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoursesCompact } from "@/hooks/use-courses-compact";
import { useLanguage } from "@/providers/language-provider";
import type { AudienceKey } from "@/config/audiences";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CourseFilterProps {
    audience?: AudienceKey;
    selectedCourses: string[];
    onToggleCourse: (courseId: string) => void;
    label?: string;
    selectLabel?: string;
}

export const CourseFilter = ({
    audience,
    selectedCourses,
    onToggleCourse,
    label,
    selectLabel,
}: CourseFilterProps) => {
    const { t } = useTranslation();
    const { lang } = useLanguage();
    const { courses, isLoading } = useCoursesCompact({ audience });

    const displayLabel = label || t('announcements.list.courses');
    const displaySelectLabel = selectLabel || t('announcements.list.selectCourses');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-16" />
                        </>
                    ) : (
                        <>
                            <Filter className="h-4 w-4" />
                            {displayLabel}
                            {selectedCourses.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                    {selectedCourses.length}
                                </Badge>
                            )}
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-100 overflow-y-auto">
                <DropdownMenuLabel>{displaySelectLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                    <div className="p-2 space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        {t('announcements.list.noCourses')}
                    </div>
                ) : (
                    courses.map(course => (
                        <DropdownMenuCheckboxItem
                            key={course.id}
                            checked={selectedCourses.includes(course.id)}
                            onCheckedChange={() => onToggleCourse(course.id)}
                        >
                            <div className="flex items-center gap-2">
                                <span 
                                    className={`h-2 w-2 rounded-full bg-${course.color}`}
                                    style={{ backgroundColor: `hsl(var(--${course.color}))` }}
                                />
                                <span className="font-mono text-xs">{course.code}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {course.title[lang as 'tr' | 'en']}
                                </span>
                            </div>
                        </DropdownMenuCheckboxItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
