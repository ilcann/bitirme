import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Bell, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

interface AnnouncementCardProps {
    id: string;
    courseId: string;
    title: string;
    description: string;
    date: string;
    isNew?: boolean;
    variant?: 'compact' | 'wide';
}

export const AnnouncementCard = ({ id, courseId, title, description, date, isNew, variant = 'compact' }: AnnouncementCardProps) => {
    const { t } = useTranslation('announcements');

    // Define color scheme based on announcement status
    const colors = isNew ? {
        accent: 'bg-chart-5',
        bgLight: 'bg-chart-5/10',
        text: 'text-chart-5',
        hoverBorder: 'hover:border-chart-5/40',
        gradient: 'from-chart-5/5 to-transparent'
    } : {
        accent: 'bg-chart-3',
        bgLight: 'bg-chart-3/10',
        text: 'text-chart-3',
        hoverBorder: 'hover:border-chart-3/40',
        gradient: 'from-chart-3/5 to-transparent'
    };

    if (variant === 'wide') {
        return (
            <Card className={`group relative rounded-xl border-2 transition-all hover:shadow-lg ${colors.hoverBorder} overflow-hidden`}>
                <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                
                <CardContent className="relative p-5">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`shrink-0 p-3 rounded-xl ${colors.bgLight} transition-transform group-hover:scale-110`}>
                            <Bell className={`h-5 w-5 ${colors.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {courseId.toUpperCase()}
                                        </Badge>
                                        {isNew && (
                                            <Badge className={`${colors.accent} text-white text-xs`}>
                                                {t("new")}
                                            </Badge>
                                        )}
                                        <div className="flex items-center gap-1.5 ml-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <time className="text-xs text-muted-foreground font-medium">{date}</time>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-base group-hover:text-primary transition-colors mb-1">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {description}
                                    </p>
                                </div>

                                {/* Action */}
                                <Button 
                                    asChild 
                                    variant="ghost"
                                    size="sm"
                                    className="shrink-0 group/btn"
                                >
                                    <Link to={`/announcements/${id}`}>
                                        {t("viewTheAnnouncement")}
                                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
    <Card className={`group relative rounded-2xl border-2 transition-all hover:shadow-xl ${colors.hoverBorder} overflow-hidden`}>
        {/* Gradient background overlay */}
        <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
        
        <CardContent className="relative p-4 space-y-3 py-2">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className={`shrink-0 p-2.5 rounded-xl ${colors.bgLight} transition-transform group-hover:scale-110`}>
                    <Bell className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-xs">
                            {courseId.toUpperCase()}
                        </Badge>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 pt-2 border-t">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <time className="text-xs text-muted-foreground font-medium">{date}</time>
            </div>

            {/* Action */}
            <Button 
                asChild 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between px-0 text-primary group/btn mt-2"
            >
                <Link to={`/announcements/${id}`}>
                    {t("viewTheAnnouncement")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </Button>
        </CardContent>
    </Card>
    );
};