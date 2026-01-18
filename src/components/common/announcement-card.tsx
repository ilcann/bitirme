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
            <Card className={`group relative rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${colors.hoverBorder} overflow-hidden`}>
                <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                
                <CardContent className="relative p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Left: Icon & Content */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            {/* Icon */}
                            <div className={`shrink-0 p-3 rounded-xl ${colors.bgLight} transition-transform duration-300 group-hover:scale-110`}>
                                <Bell className={`h-6 w-6 ${colors.text}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                                        {courseId.toUpperCase()}
                                    </Badge>
                                    {isNew && (
                                        <Badge className={`${colors.accent} text-white text-xs px-2 py-0.5`}>
                                            {t("new")}
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors duration-200 mb-2">
                                    {title}
                                </h3>
                                <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                                    {description}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <time className="text-sm text-muted-foreground font-medium">{date}</time>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex sm:flex-col sm:min-w-40">
                            <Button 
                                asChild 
                                className="w-full rounded-lg font-medium h-10"
                            >
                                <Link to={`/announcements/${id}`}>
                                    {t("viewTheAnnouncement")}
                                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`group relative rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${colors.hoverBorder} overflow-hidden`}>
            {/* Gradient background overlay */}
            <div className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            
            <CardContent className="relative p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className={`shrink-0 p-2.5 rounded-xl ${colors.bgLight} transition-transform duration-300 group-hover:scale-110`}>
                        <Bell className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                                {courseId.toUpperCase()}
                            </Badge>
                            {isNew && (
                                <Badge className={`${colors.accent} text-white text-xs px-2 py-0.5`}>
                                    {t("new")}
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-3 pt-3 border-t">
                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <time className="text-xs text-muted-foreground font-medium">{date}</time>
                    </div>

                    {/* Action */}
                    <Button 
                        asChild 
                        size="sm" 
                        className="w-full justify-between px-3 group/btn h-9"
                    >
                        <Link to={`/announcements/${id}`}>
                            {t("viewTheAnnouncement")}
                            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};