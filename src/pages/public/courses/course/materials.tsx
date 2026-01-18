import { useTranslation } from "react-i18next";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useMaterials } from "@/hooks/use-materials";
import { useOutletContext } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { MaterialCard } from "@/components/common/material-card";
import { MaterialCardSkeleton } from "@/components/common/material-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
    FileText,
    Filter,
    ArrowUpDown,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
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
        materials,
        total,
        currentPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        isLoading,
        isFetching,
        searchQuery,
        selectedTypes,
        sortBy,
        updateSearch,
        toggleType,
        updateSortBy,
        goToNextPage,
        goToPreviousPage,
        clearAllFilters,
    } = useMaterials({ 
        courseId: course?.id || "",
        initialLimit: 5
    });

    const materialTypes: MaterialType[] = ["lecture", "assignment", "exam", "document", "video", "link"];
    const activeFilterCount = selectedTypes.length + (sortBy !== 'newest' ? 1 : 0);

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
                        value={searchQuery}
                        onChange={(e) => updateSearch(e.target.value)}
                        placeholder={t("home.search.placeholder")}
                        className="pl-10 h-11 rounded-xl border-2"
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                {t('courses.materials.filters.type')}
                                {selectedTypes.length > 0 && (
                                    <Badge variant="secondary" className="ml-2">
                                        {selectedTypes.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>{t('courses.materials.filters.type')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {materialTypes.map((type) => (
                                <DropdownMenuCheckboxItem
                                    key={type}
                                    checked={selectedTypes.includes(type)}
                                    onCheckedChange={() => toggleType(type)}
                                >
                                    {t(`courses.materials.types.${type}`)}
                                </DropdownMenuCheckboxItem>
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
                            <DropdownMenuItem onClick={() => updateSortBy("newest")}>
                                {t('courses.materials.sort.newest')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSortBy("oldest")}>
                                {t('courses.materials.sort.oldest')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateSortBy("title")}>
                                {t('courses.materials.sort.title')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                            {t('courses.materials.clearFilters')}
                        </Button>
                    )}
                </div>
            </motion.div>

            {/* Results Count & Pagination Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center justify-between text-sm text-muted-foreground"
            >
                <span>
                    {isLoading ? t('common:common.pagination.loading') : `${total} ${t('courses.materials.resultsCount')}`}
                </span>
                <div className="flex items-center gap-3">
                    {totalPages > 1 && (
                        <span>
                            {t('common.pagination.page', { current: currentPage + 1, total: totalPages })}
                        </span>
                    )}
                    {isFetching && !isLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                </div>
            </motion.div>

            {/* Materials List */}
            {isLoading ? (
                <div className="grid gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <MaterialCardSkeleton key={index} />
                    ))}
                </div>
            ) : materials.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t('courses.materials.noMaterials.title')}</h3>
                        <p className="text-muted-foreground">{t('courses.materials.noMaterials.description')}</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <motion.div
                        className="grid gap-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.06
                                }
                            }
                        }}
                    >
                        {materials.map((material) => (
                            <motion.div
                                key={material.id}
                                variants={{
                                    hidden: { opacity: 0, y: 15 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <MaterialCard material={material} />
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
            )}
        </section>
    );
}

export default CourseMaterialsPage;