import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const MaterialCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        {/* Icon Skeleton */}
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        
                        <div className="flex-1 min-w-0 space-y-2">
                            {/* Title Skeleton */}
                            <Skeleton className="h-6 w-3/4" />
                            
                            {/* Badges and Date Skeleton */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            
                            {/* Description Skeleton */}
                            <div className="space-y-1.5 pt-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Button Skeleton */}
                    <Skeleton className="h-9 w-24 rounded-md" />
                </div>
            </CardHeader>
        </Card>
    );
};
