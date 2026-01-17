import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useTheme } from "@/providers/theme-provider"
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { t } = useTranslation();

  return (
    <MenubarMenu>
      <MenubarTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t("theme_toggle.title")}</span>
        </Button>
      </MenubarTrigger>
      <MenubarContent align="end">
        <MenubarItem onClick={() => setTheme("light")}>
          {t("theme_toggle.light")}
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("dark")}>
          {t("theme_toggle.dark")}
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("system")}>
          {t("theme_toggle.system")}
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}