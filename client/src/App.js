import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

import ConfigPage from "./Configs/ConfigPage";
import PortalPage from "./Portal/PortalPage";
import Loading from "./UI/Loading";
import DevicesPage from './Devices/DevicesPage'

function App() {
  
  return (
    <>
      {/* <PortalPage /> */}
      <ConfigPage />
      <DevicesPage />
    </>
    // <SharingPage />
    // <DashboardPage />
  );
}

export default App;
