import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useOutletContext } from "react-router";
import type { MockCourse } from "@/mock/courses";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialCard } from "@/components/common/material-card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { 
    FileText,
    Filter,
    ArrowUpDown
} from "lucide-react";
import type { MaterialType } from "@/mock/courses";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CourseMaterialsPage = () => {
    const { t, i18n } = useTranslation('courses');
    const { course } = useOutletContext<{ course: MockCourse }>();
    const [filterType, setFilterType] = useState<MaterialType | "all">("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
    
    useDocumentTitle(
        `${course?.code} - ${t('materials.title')}`,
        t('materials.description')
    );

    const filteredAndSortedMaterials = useMemo(() => {
        if (!course?.materials) return [];

        let filtered = course.materials;
        
        // Filter
        if (filterType !== "all") {
            filtered = filtered.filter(m => m.type === filterType);
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case "oldest":
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case "title":
                    return a.title[i18n.language as 'tr' | 'en'].localeCompare(
                        b.title[i18n.language as 'tr' | 'en']
                    );
                default:
                    return 0;
            }
        });

        return sorted;
    }, [course, filterType, sortBy, i18n.language]);

    return (
        <section className="container mx-auto py-4 px-4 space-y-6">
            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            {filterType === "all" ? t('courses.materials.allTypes') : t(`courses.materials.types.${filterType}`)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setFilterType("all")}>
                            {t('courses.materials.allTypes')}
                        </DropdownMenuItem>
                        {(["lecture", "assignment", "exam", "document", "video", "link"] as MaterialType[]).map((type) => (
                            <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                                {t(`courses.materials.types.${type}`)}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {t(`courses.materials.sort.${sortBy}`)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setSortBy("newest")}>
                            {t('courses.materials.sort.newest')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                            {t('courses.materials.sort.oldest')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("title")}>
                            {t('courses.materials.sort.title')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Materials List */}
            {filteredAndSortedMaterials.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t('courses.materials.noMaterials.title')}</h3>
                        <p className="text-muted-foreground">{t('courses.materials.noMaterials.description')}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredAndSortedMaterials.map((material) => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default CourseMaterialsPage;