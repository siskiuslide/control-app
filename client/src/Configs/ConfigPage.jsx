import React, { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import ConfigList from "./ConfigList";
import NewConfigSection from "./NewConfigSection";

import "./ConfigPage.css";

const ConfigPage = (props) => {
  const [configsList, setConfigsList] = useState([]);

  useEffect(() => {
    const configs = fetch("config")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setConfigsList(data.body);
      });
  }, []);

  const createNewConfig = () => {};

  return (
    <>
      <Navbar />
      <div className="configPage">
        <ConfigList configs={configsList} />
        <NewConfigSection onCreate={createNewConfig} />
      </div>
    </>
  );
};

export default ConfigPage;
