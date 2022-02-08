import React, { useState } from "react";
import Button from "../UI/Button";
import NewConfigForm from "./NewConfigForm";
import "./NewConfigSection.css";

const NewConfigSection = (props) => {
  const [addNew, setAddNew] = useState(false);

  const addConfigHandler = () => {
    setAddNew(true);
  };
  const cancelConfigForm = () => {
    console.log("x");
    setAddNew(false);
  };
  return (
    <div className="NewConfigSection">
      {!addNew && <Button text={"Create new"} onClick={addConfigHandler} style={{ marginTop: "2vh" }} />}
      {addNew && <NewConfigForm onCancel={cancelConfigForm} />}
    </div>
  );
};

export default NewConfigSection;
