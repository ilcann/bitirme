import { Logo } from "../logo";
import SettingsMenubar from "./settings-menubar";
import MobileMenu from "./mobile-menu";
import Navbar from "./navbar";

const AppHeader = () => {
  return (
    <header className="px-4 py-2 border-b">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Logo />
        <Navbar variant="desktop" className="hidden lg:flex" />
        <SettingsMenubar className="hidden lg:flex" />
        <MobileMenu />
      </div>
    </header>
  );
}

export default AppHeader;