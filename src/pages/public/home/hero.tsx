import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Bell, BookOpen, Megaphone, Scale, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

type HeroProps = {
    audience: "department" | "common";
};

const Hero = ({ audience }: HeroProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const onSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        const q = query.trim();
        navigate(`/courses${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    };

    return (
      <section className="relative overflow-hidden rounded-3xl border-2 bg-linear-to-br from-card via-card to-muted/30">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative p-6 md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr,420px] lg:gap-12">
            {/* Left: Title & Description */}
            <div className="space-y-6">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
                audience === "department" 
                  ? "bg-chart-4/10 text-chart-4" 
                  : "bg-chart-1/10 text-chart-1"
                }`}>
                <Sparkles className="h-4 w-4" />
                {audience === "department" 
                  ? t("home.hero.badge.department") 
                  : t("home.hero.badge.common")}
                </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {t("home.hero.title")}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {t("home.hero.description")}
                </p>
              </div>

              {/* Notice Alert - integrated into hero */}
              {audience === "common" ? (
                <Alert className="rounded-xl border border-chart-1/30 bg-chart-1/5 mt-4">
                  <Megaphone className="h-4 w-4 text-chart-1" />
                  <AlertTitle className="text-sm font-semibold">
                    {t("home.notice.common.title")}
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed mt-1 text-muted-foreground">
                    <p>{t("home.notice.common.line1")}</p>
                    <p>{t("home.notice.common.line2")}{" "}
                      <Label className="text-chart-4 font-semibold">
                        {t("home.notice.common.changeAudience")}
                      </Label>
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="rounded-xl border border-chart-4/30 bg-chart-4/5 mt-4">
                  <Megaphone className="h-4 w-4 text-chart-4" />
                  <AlertTitle className="text-sm font-semibold">
                    {t("home.notice.department.title")}
                  </AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed mt-1 text-muted-foreground">
                    <p>{t("home.notice.department.line1")}</p>
                    <p>{t("home.notice.department.line2")}{" "}
                      <Label className="text-chart-4 font-semibold">
                        {t("home.notice.department.changeAudience")}
                      </Label>
                    </p>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Right: Search & Actions */}
            <div className="space-y-4">
              <form onSubmit={onSearch} className="space-y-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("home.search.placeholder")}
                    className="pl-12 h-12 text-base rounded-xl border-2 bg-background transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl h-12 font-semibold cursor-pointer">
                  {t("home.search.button")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12 border-2 hover:bg-chart-1/10 hover:border-chart-1/50 hover:text-foreground transition-colors">
                  <Link to="/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t("home.actions.courses")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12 border-2 hover:bg-chart-2/10 hover:border-chart-2/50 hover:text-foreground transition-colors">
                  <Link to="/announcements">
                    <Bell className="mr-2 h-4 w-4" />
                    {t("home.actions.announcements")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12 border-2 hover:bg-chart-3/10 hover:border-chart-3/50 hover:text-foreground transition-colors">
                  <Link to="/help">
                    <Scale className="mr-2 h-4 w-4" />
                    {t("home.actions.help")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Hero;