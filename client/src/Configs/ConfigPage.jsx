import React, { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import ConfigList from "./ConfigList";
import NewConfigSection from "./NewConfigSection";

import "./ConfigPage.css";
import Loading from "../UI/Loading";

const ConfigPage = (props) => {
  const [configsList, setConfigsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
 
  
  useEffect(() => {
    const configs = fetch("/config")
    .then((res) => {return res.json()})
    .then((data) => {
      setConfigsList(data.body);
    })
    .catch(err=>console.log(err));
  }, []);

  const createNewConfig = () => {};

  return (
    <>
      <Navbar />
      <div className="configPage">
        <h1 style={{color: 'white'}}>Network List</h1>
        <NewConfigSection onCreate={createNewConfig} />
       <ConfigList configs={configsList} />
      </div>
    </>
  );
};

export default ConfigPage;
