import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";

import ConfigPage from "./Configs/ConfigPage";
import PortalPage from "./Portal/PortalPage";

function App() {
  return (
    <>
      {/* <PortalPage /> */}
      <ConfigPage />
    </>
    // <DevicePage />
    // <SharingPage />
    // <DashboardPage />
  );
}

export default App;
