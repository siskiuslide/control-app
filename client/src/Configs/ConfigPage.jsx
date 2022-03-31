import React, { useEffect, useState } from "react";
import Navbar from "../UI/Navbar";
import ConfigList from "./ConfigList";
import NewConfigSection from "./NewConfigSection";

import "./ConfigPage.css";
import Loading from "../UI/Loading";

const ConfigPage = (props) => {
  const [configsList, setConfigsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)  
  const [addNew, setAddNew] = useState(false); //if true, show the form to create new config

  const addConfigHandler = () => {
    setAddNew(true);
  };
  const cancelConfigForm = () => {
    setAddNew(false);
  };

  useEffect(() => {
    const configs = fetch("/config")
    .then((res) => {
      if(res.status === 401){throw new Error('Login to access your networks')}
      return res.json()
    })
    .then((data) => {
      setConfigsList(data.body);      
    })
    .catch(err=>console.log(err));
  }, []);


  const createNewConfig = () => {};

  const deleteHandler = (e) => {
    e.preventDefault()
    const target = e.target.closest('.config').id
    const deletedNetwork = fetch(`/config`, {method: 'DELETE', body: JSON.stringify({id: target}), headers:{'Content-Type': 'application/json'}})
    .then(res=>{return res.json()})
    .then(data=>{return data})
    .catch(err=>{console.log(err)})
    setConfigsList(configsList.filter(conf=> conf._id !== target))
  }

  return (
    <>
      <Navbar />
      <div className="configPage">
        { !addNew && <h1 style={{color: 'white'}}>Network List</h1>}
        <NewConfigSection onCreate={createNewConfig} addNewHandler={addConfigHandler} cancelHandler={cancelConfigForm} addNew={addNew}  />
        <ConfigList configs={configsList} onDelete={deleteHandler}/>
      </div>
    </>
  );
};

export default ConfigPage;
