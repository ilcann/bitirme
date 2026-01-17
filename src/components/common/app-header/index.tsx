import { Logo } from "../logo";
import Navbar from "./navbar";
import SettingsMenubar from "./settings-menubar";
import MobileMenu from "./mobile-menu";

const AppHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <Logo />
      <Navbar className="hidden lg:flex" />
      <SettingsMenubar className="hidden lg:flex" />
      <MobileMenu />
    </header>
  );
}

export default AppHeader;