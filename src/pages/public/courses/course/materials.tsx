import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useMaterialFilter } from "@/hooks/use-material-filter";
import { useOutletContext } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialCard } from "@/components/common/material-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    FileText,
    Filter,
    ArrowUpDown,
    Search
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Course } from "@/types/course";
import type { MaterialType } from "@/types/course-material";

const CourseMaterialsPage = () => {
    const { t } = useTranslation('courses');
    const { course } = useOutletContext<{ course: Course }>();

    useDocumentTitle(
        `${course?.code} - ${t('materials.title')}`,
        t('materials.description')
    );

    const {
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        sortBy,
        setSortBy,
        filteredAndSortedMaterials,
    } = useMaterialFilter(course?.materials);

    return (
        <section className="container mx-auto py-4 px-4 space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("home.search.placeholder")}
                        className="pl-10 h-11 rounded-xl border-2"
                    />
                </div>
                <div className="flex gap-2">
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