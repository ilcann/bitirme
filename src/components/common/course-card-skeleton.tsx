import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface CourseCardSkeletonProps {
    variant?: 'compact' | 'wide';
}

export const CourseCardSkeleton = ({ variant = 'compact' }: CourseCardSkeletonProps) => {
    if (variant === 'wide') {
        return (
            <Card className="relative rounded-xl border-2 overflow-hidden">
                <CardContent className="relative p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Left: Icon & Course Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Icon Skeleton */}
                            <Skeleton className="shrink-0 h-14 w-14 rounded-xl" />
                            
                            <div className="flex-1 min-w-0 space-y-3">
                                {/* Course Code Skeleton */}
                                <Skeleton className="h-7 w-32" />
                                
                                {/* Title Skeleton */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                                
                                {/* Students Count Skeleton */}
                                <div className="flex items-center gap-1.5">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex sm:flex-col gap-2 sm:min-w-40">
                            <Skeleton className="h-10 flex-1 sm:w-full rounded-lg" />
                            <Skeleton className="h-10 flex-1 sm:w-full rounded-lg" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Compact variant (default)
    return (
        <Card className="relative rounded-xl border-2 overflow-hidden">
            <CardContent className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Icon Skeleton */}
                    <Skeleton className="shrink-0 h-10 w-10 rounded-xl" />
                    
                    <div className="flex-1 min-w-0 space-y-2">
                        {/* Course Code Skeleton */}
                        <Skeleton className="h-5 w-24" />
                        
                        {/* Title Skeleton */}
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-1.5 pb-3 mb-3 border-b">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-20" />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-9 rounded-lg" />
                    <Skeleton className="h-9 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
};
