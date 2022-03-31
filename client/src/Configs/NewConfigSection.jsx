import React, { useState } from "react";
import Button from "../UI/Button";
import NewConfigForm from "./NewConfigForm";
import "./NewConfigSection.css";

const NewConfigSection = (props) => {
  const {addNew, addNewHandler, cancelHandler} = props
  console.log(props)
  
  return (
    <div className="NewConfigSection">
      {!addNew && <Button text={"Create new"} onClick={addNewHandler} style={{ marginTop: "2vh" }} />}
      {addNew && <NewConfigForm onCancel={cancelHandler} />}
    </div>
  );
};

export default NewConfigSection;
