import React, { useState } from "react";
import "./Portal.css";
import Button from "../UI/Button";

const Portal = () => {
  const [sol, setSol] = useState("login");
  const [endpoint, setEndpoint] = useState("users/login");

  const solSwitchHandler = () => {
    sol === "login" ? setSol("signup") : setSol("login");
    sol === "login" ? setEndpoint("users/signup") : setEndpoint("users/login");
  };

  const [formData, setFormData] = useState({});
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    
    const outcome = await fetch(`${endpoint}`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    }).then(

      
      setFormData({name: '',email: '', password: '', passwordConfirm: ''}))
  };

  return (
    <div className="Portal">
      <form className="portalForm" action={sol === "login" ? "users/login" : "users/signup"}>
        <h1 className="peachGradientText">{sol === "login" ? "Login" : "Get Started"}</h1>
        {sol === "signup" && <label>Name</label>}
        {sol === "signup" && (
          <input
            type="text"
            onChange={(e) => {
              setFormData({...formData, name: e.target.value});
            }}
            value={formData.name}
          ></input>
        )}
        <label>Email</label>
        <input
          type="text"
          onChange={(e) => {
            setFormData({...formData, email:(e.target.value)});
          }}
          placeholder={"example@control.com"}
          value={formData.email}
        ></input>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => {
            setFormData({...formData, password: (e.target.value)})
          }}
          value={formData.password}
        ></input>
        {sol === "signup" && <label>Confirm password</label>}
        {sol === "signup" && (
          <input
            type="password"
            onChange={(e) => {
              setFormData({...formData, passwordConfirm: e.target.value});
            }}
            value={formData.passwordConfirm}
          ></input>
        )}
        <div className="portalButtons">
          <Button text={sol === "login" ? "Login" : "Sign Up"} onClick={formSubmitHandler} />
          <a href="#" className="textLink" onClick={solSwitchHandler}>
            {sol === "login" ? "Don't have an account?" : "Already got an account?"}
          </a>
        </div>
      </form>
    </div>
  );
};
export default Portal;
