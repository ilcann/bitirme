import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAudience } from "@/providers/audience-provider";
import { ArrowRight, Bell, BookOpen, Megaphone, Scale, Search, Sparkles } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { audience } = useAudience();

  const [query, setQuery] = React.useState("");

  const activeViewLabel = audience === "pool" 
    ? t("common.audience.pool") 
    : t("common.audience.department");

  // Featured courses  (mock)
  const featuredCourses = React.useMemo(() => {
    const pool = [
      { id: "mat103e", code: "MAT 103/E", title: t("courses.mat103e") },
      { id: "mat104e", code: "MAT 104/E", title: t("courses.mat104e") },
    ];
    const dept = [
      { id: "mat345e", code: "MAT 345/E", title: t("courses.mat345e") },
      { id: "mat471e", code: "MAT 471/E", title: t("courses.mat471e") },
      { id: "mate", code: "MATE", title: t("courses.mate") },
    ];
    return (audience === "pool" ? pool : dept).slice(0, 6);
  }, [audience, t]);

  // Latest announcements (mock)
  const latestAnnouncements = [
    { id: "a1", title: t("home.announcements.midterm"), date: "2026-01-12", courseId: "mat103e" },
    { id: "a2", title: t("home.announcements.officeHours"), date: "2026-01-10", courseId: "mat471e" },
    { id: "a3", title: t("home.announcements.newMaterials"), date: "2026-01-08", courseId: "mat104e" },
  ];

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    navigate(`/courses${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:py-12 space-y-8">
      {/* HERO SECTION - Modernized */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/5 via-background to-background border shadow-sm">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        
        <div className="relative p-6 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
            {/* Left: Title & Description */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                {t("home.hero.badge")}
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                  {t("home.hero.title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {t("home.hero.description")}
                </p>
              </div>

              {/* Active View Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                  <span className="mr-2">✓</span>
                  {t("home.hero.activeView")}: {activeViewLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t("home.hero.viewHint")}
                </span>
              </div>
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
                    className="pl-12 h-12 text-base rounded-xl border-2 transition-all focus:border-primary"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl h-12">
                  {t("home.search.button")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>

              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12">
                  <Link to="/tr/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t("home.actions.courses")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12">
                  <Link to="/tr/announcements">
                    <Bell className="mr-2 h-4 w-4" />
                    {t("home.actions.announcements")}
                  </Link>
                </Button>
              </div>

              <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                <Link to="/tr/rules">
                  <Scale className="mr-2 h-4 w-4" />
                  {t("home.actions.rules")}
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICE - View-specific Alerts */}
      {audience === "pool" ? (
        <Alert className="rounded-2xl border-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            {t("home.notice.pool.title")}
          </AlertTitle>
          <AlertDescription className="text-sm leading-relaxed mt-3 space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              {t("home.notice.pool.line1")}
            </p>
            <p className="font-medium">
              {t("home.notice.pool.line2")}
            </p>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="rounded-2xl border-2 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
          <Megaphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <AlertTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            {t("home.notice.department.title")}
          </AlertTitle>
          <AlertDescription className="text-sm leading-relaxed mt-3 space-y-3 text-purple-800 dark:text-purple-200">
            <p>
              {t("home.notice.department.line1")}
            </p>
            <p>
              {t("home.notice.department.line2")}{" "}
              <Button asChild variant="link" className="h-auto p-0 text-purple-600 dark:text-purple-400 font-semibold underline">
                <Link to="/tr/courses?view=pool">
                  {t("home.notice.department.poolLink")}
                </Link>
              </Button>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* FEATURED COURSES */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("home.featured.title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("home.featured.description")}
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex rounded-xl">
            <Link to="/tr/courses">
              {t("home.featured.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((c) => (
            <Card key={c.id} className="rounded-2xl border-2 hover:border-primary/50 transition-all hover:shadow-md group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                      <BookOpen className="h-5 w-5" />
                      {c.code}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-1">{c.title}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1 rounded-lg">
                    <Link to={`/tr/courses/${c.id}`}>
                      {t("home.featured.open")}
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1 rounded-lg">
                    <Link to={`/tr/courses/${c.id}/materials`}>
                      {t("home.featured.materials")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button asChild variant="outline" className="w-full sm:hidden rounded-xl">
          <Link to="/tr/courses">
            {t("home.featured.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* LATEST ANNOUNCEMENTS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t("home.announcements.title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("home.announcements.description")}
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:flex rounded-xl">
            <Link to="/tr/announcements">
              {t("home.announcements.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestAnnouncements.map((a) => (
            <Card key={a.id} className="rounded-2xl border-2 hover:border-primary/50 transition-all hover:shadow-md group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base font-semibold line-clamp-2 flex-1 group-hover:text-primary transition-colors">
                    {a.title}
                  </CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Badge variant="secondary" className="font-normal text-xs">
                    {a.courseId.toUpperCase()}
                  </Badge>
                  <span>•</span>
                  <time>{a.date}</time>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="ghost" size="sm" className="w-full justify-start px-0 text-primary">
                  <Link to={`/tr/announcements?courseId=${a.courseId}`}>
                    {t("home.announcements.viewTheAnnouncement")}
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button asChild variant="outline" className="w-full sm:hidden rounded-xl">
          <Link to="/tr/announcements">
            {t("home.announcements.viewAll")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* RULES SECTION */}
      <section>
        <Card className="rounded-2xl border-2 bg-linear-to-br from-muted/50 to-background hover:border-primary/50 transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              {t("home.rules.title")}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {t("home.rules.description")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="grid gap-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>{t("home.rules.item1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>{t("home.rules.item2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">✓</span>
                <span>{t("home.rules.item3")}</span>
              </li>
            </ul>
            <Button asChild className="w-full rounded-xl" size="lg">
              <Link to="/tr/rules">
                {t("home.rules.button")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default HomePage;