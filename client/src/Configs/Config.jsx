import React from "react";

import "./Config.css";

const Config = (props) => {
  const { name, type, appID, favourite, id } = props;

  const deleteNetworkHandler = (e)=>{
    e.preventDefault()
  }

  return (
    <a href="/configs/:id/devices" className="config" id={id}>
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
          {favourite == "true" ? "star" : "star_outline"}
        </span>
        <span className="material-icons edit-icon">edit</span>
        <span className="material-icons delete-icon" onClick={props.onDelete}>delete</span>
        <span className="material-icons chevron-icon" style={{fontSize: '2em !important'}}>chevron_right</span>
      </div>
    </a>
  );
};

export default Config;
