import React from "react";

import "./Config.css";

const Config = (props) => {
  const { name, type, appID, favourite, id } = props;

  const setActiveNetwork = (e)=>{
    const ls = window.localStorage
    ls.setItem('activeNetwork', e.target.closest('.config').id)
    //set the activenetwork so when devices page loads it can select the network you pressed.
  }

  return (
    <a href="#devicespage" className="config" id={id} onClick={setActiveNetwork}>
      <div className="configInfo">
        <span className="material-icons" alt={type}>
          {type === "on" || 'Cloud' ? "cloud" : "network_ping"}
        </span>
        <h3>{name}</h3>
        <p className="config-appid">
          App: <b>{appID}</b>
        </p>
      </div>
      <div className="configIcons">
        <span
          className="material-icons favourite-icon"
          style={favourite === "true" ? { color: "#eeff00" } : { color: "white" }}
        >
          {favourite === "true" ? "star" : "star_outline"}
        </span>
        <span className="material-icons edit-icon">edit</span>
        <span className="material-icons delete-icon" onClick={props.onDelete}>delete</span>
        <span className="material-icons chevron-icon" style={{fontSize: '2em !important'}}>chevron_right</span>
      </div>
    </a>
  );
};

export default Config;
