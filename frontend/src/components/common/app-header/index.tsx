import { Logo } from "../logo";
import SettingsMenubar from "./settings-menubar";
import MobileMenu from "./mobile-menu";
import Navbar from "./navbar";
import AuthButton from "../auth/auth-button";
import LoginModal from "../auth/login-modal";

const AppHeader = () => {
  return (
    <>
      <header className="px-4 py-2 border-b">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <Logo />
          <Navbar variant="desktop" className="hidden lg:flex" />
          <div className="flex items-center gap-2">
            <SettingsMenubar className="hidden lg:flex" />
            <AuthButton className="hidden lg:inline-flex" />
            <MobileMenu />
          </div>
        </div>
      </header>
      <LoginModal />
    </>
  );
}

export default AppHeader;