import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, FileText, Megaphone, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const RulesSection = () => {
  const { t } = useTranslation();

  const rules = [
    { text: t("home.rules.item1"), icon: Calendar },
    { text: t("home.rules.item2"), icon: FileText },
    { text: t("home.rules.item3"), icon: Megaphone },
  ];

  return (
    <section>
      <Card className="rounded-2xl border-2 overflow-hidden">
        <div className="h-1 bg-linear-to-r from-chart-1 via-chart-3 to-chart-5" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 rounded-xl bg-linear-to-br from-chart-1/20 to-chart-3/20">
              <Scale className="h-5 w-5 text-chart-1" />
            </div>
            {t("home.rules.title")}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {t("home.rules.description")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="grid gap-3">
            {rules.map((rule, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="shrink-0 p-1.5 rounded-lg bg-background">
                  <rule.icon className="h-4 w-4 text-chart-3" />
                </div>
                <span className="text-sm leading-relaxed">{rule.text}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full rounded-xl" size="lg">
            <Link to="/rules">
              {t("home.rules.button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default RulesSection;
