import React from "react";
import "./Config.css";

const Config = (props) => {
  const { name, type, appID, favourite } = props;
  return (
    <a href="/configs/:id/devices" class="config">
      <div className="configInfo">
        <span className="material-icons" alt={type}>
          {type === "on" ? "cloud" : "network_ping"}
        </span>
        <h3>{name}</h3>
        <p>
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
        <span className="material-icons delete-icon">delete</span>
        <span className="material-icons chevron-icon">chevron_right</span>
      </div>
    </a>
  );
};

export default Config;
