import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface AnnouncementCardSkeletonProps {
    variant?: 'compact' | 'wide';
}

export const AnnouncementCardSkeleton = ({ variant = 'compact' }: AnnouncementCardSkeletonProps) => {
    if (variant === 'wide') {
        return (
            <Card className="relative rounded-xl border-2 overflow-hidden">
                <CardContent className="relative p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Left: Icon & Content */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Icon Skeleton */}
                            <Skeleton className="shrink-0 h-14 w-14 rounded-xl" />

                            {/* Content Skeleton */}
                            <div className="flex-1 min-w-0 space-y-3">
                                {/* Badges */}
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-12" />
                                </div>
                                
                                {/* Title */}
                                <Skeleton className="h-7 w-3/4" />
                                
                                {/* Description */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                                
                                {/* Date */}
                                <div className="flex items-center gap-1.5">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Button */}
                        <div className="flex sm:flex-col sm:min-w-40">
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative rounded-xl border-2 overflow-hidden">
            <CardContent className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Icon Skeleton */}
                    <Skeleton className="shrink-0 h-12 w-12 rounded-xl" />
                    
                    {/* Title & Badges */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                        <Skeleton className="h-6 w-4/5" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
};
