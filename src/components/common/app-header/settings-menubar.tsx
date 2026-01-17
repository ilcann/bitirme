import { Menubar } from "@/components/ui/menubar";
import { AudienceToggle } from "../audience-toggle";
import { LanguageToggle } from "../language-toggle";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";

interface SettingsMenubarProps {
  className?: string;
}

const SettingsMenubar = ({ className }: SettingsMenubarProps) => {
  return (
    <Menubar className={cn("border-0", className)}>
        <AudienceToggle />
        <LanguageToggle />
        <ThemeToggle />
    </Menubar>
  );
}

export default SettingsMenubar;