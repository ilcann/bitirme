import Navbar from "./navbar";
import SettingsMenubar from "./settings-menubar";

const AppHeader = () => {
  return <header>
    <SettingsMenubar />
    <Navbar />
  </header>;
}

export default AppHeader;