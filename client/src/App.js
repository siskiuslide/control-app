import logo from "./logo.svg";
import "./App.css";
import { useLayoutEffect, useState } from "react";

import ConfigPage from "./Configs/ConfigPage";
import PortalPage from "./Portal/PortalPage";
import Loading from "./UI/Loading";
import DevicesPage from './Devices/DevicesPage'

function App() {

  const [sw, setsw] = useState(window.innerWidth)
  const updateSize=()=>{
    setsw(window.innerWidth)
  }
  useLayoutEffect(()=>{
    window.addEventListener('resize', updateSize)
  })
  
  return (
    <>
      <PortalPage pageWidth={sw}/>
      <ConfigPage pageWidth={sw}/>
      <DevicesPage pageWidth={sw}/>
    </>
    // <SharingPage />
    // <DashboardPage />
  );
}

export default App;
