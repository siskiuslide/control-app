import React, { useState } from "react";
import "./NewConfigForm.css";
import Button from "../UI/Button";

const NewConfigForm = (props) => {
  const [name, setName] = useState();
  const [type, setType] = useState("Cloud");
  const [target, setTarget] = useState();
  const [appID, setAppID] = useState();
  const [APIKey, setAPIKey] = useState();

  const [formData, setFormData] = useState({type: 'Local'});

  const submitConfigForm = (e) => {
    e.preventDefault();
    const newConfig = fetch('/config', {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res=>{return res.json()})
    .then(data=>console.log(data))
    .catch(err=>console.log(err))

    props.onCancel()
  };

  return (
    <form action="/config" method="post" className="ConfigForm">
      <h1>Connect to a network</h1>
      <label>Name</label>
      <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})}></input>
      <label>Type</label>
      <select onChange={(e) => setFormData({...formData, type: e.target.value})}>
        <option value="Local">Local</option>
        <option value="Cloud">Cloud</option>
      </select>
      <label>Cloud Address</label>
      <input type="text" onChange={(e) => {setFormData({...formData, target:e.target.value})}}></input>
      <label>App ID</label>
      <input type="text" onChange={(e) => setFormData({...formData, appID: e.target.value})}></input>
      <label>API Key</label>
      <input type="text" onChange={(e) => setFormData({...formData, APIKey: e.target.value})}></input>
      <div className="configFormBtns">
        <Button text="Cancel" onClick={props.onCancel} style={{ background: "white", color: "black" }} />
        <Button text="Submit" onClick={submitConfigForm} />
      </div>
    </form>
  );
};

export default NewConfigForm;
