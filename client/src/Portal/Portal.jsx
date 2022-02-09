import React, { useState } from "react";
import "./Portal.css";
import Button from "../UI/Button";

const Portal = () => {
  const [sol, setSol] = useState("login");
  const [endpoint, setEndpoint] = useState("users/login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const solSwitchHandler = () => {
    sol === "login" ? setSol("signup") : setSol("login");
    sol === "login" ? setEndpoint("users/signup") : setEndpoint("users/login");
  };

  const [formData, setFormData] = useState({});
  const formSubmitHandler = async (e) => {
    e.preventDefault();
    setFormData({
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });
    console.log(JSON.stringify(formData));
    const outcome = await fetch(`${endpoint}`, {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    });

    console.log(outcome);
  };

  return (
    <div className="Portal">
      <form className="portalForm" action={sol === "login" ? "users/login" : "users/signup"}>
        <h1 className="peachGradientText">{sol === "login" ? "Login" : "Get Started"}</h1>
        <label>Email</label>
        <input
          type="text"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder={"example@control.com"}
          value={email}
        ></input>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        {sol === "signup" && <label>Confirm password</label>}
        {sol === "signup" && (
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
