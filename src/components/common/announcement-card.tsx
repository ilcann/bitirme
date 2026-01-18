import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Bell, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router";

interface AnnouncementCardProps {
    id: string;
    courseId: string;
    titleKey: string;
    date: string;
    isNew?: boolean;
}

export const AnnouncementCard = ({ id, courseId, titleKey, date, isNew }: AnnouncementCardProps) => {
    const { t } = useTranslation();

    return (
    <Card className="group rounded-2xl border-2 transition-all hover:shadow-lg hover:border-primary/30">
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    {isNew && (
                    <Badge className="bg-chart-5 hover:bg-chart-5 text-primary-foreground text-[0.625rem] px-1.5 py-0">
                        {t("announcements:new")}
                    </Badge>
                    )}
                    <Badge variant="outline" className="font-mono text-xs">
                    {courseId.toUpperCase()}
                    </Badge>
                </div>
                <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {t(titleKey)}
                </CardTitle>
                </div>
                <div className="shrink-0 p-2 rounded-lg bg-muted">
                <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <Calendar className="h-3 w-3" />
                <time>{date}</time>
            </div>
        </CardHeader>
        <CardContent className="pt-0">
            <Button asChild variant="ghost" size="sm" className="w-full justify-between px-0 text-primary hover:bg-transparent group/btn">
                <Link to={`/announcements/${id}`}>
                    {t("announcements.viewTheAnnouncement")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </Button>
        </CardContent>
    </Card>
    );
};