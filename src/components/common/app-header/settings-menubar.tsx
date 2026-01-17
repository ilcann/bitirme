import { Menubar } from "@/components/ui/menubar";
import { AudienceToggle } from "../audience-toggle";
import { LanguageToggle } from "../language-toggle";
import { ThemeToggle } from "../theme-toggle";

const SettingsMenubar = () => {
  return (
    <Menubar>
        <AudienceToggle />
        <LanguageToggle />
        <ThemeToggle />
    </Menubar>
  );
}

export default SettingsMenubar;