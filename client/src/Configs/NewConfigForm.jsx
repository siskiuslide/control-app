import React from 'react';
import './NewConfigForm.css'
import Button from '../UI/Button';

const NewConfigForm = props =>{
    return (
        <form action="#" className="ConfigForm">
            <h1>Connect to a network</h1>
            <label>Name</label>
            <input type="text"></input>
            <label>Type</label>
            <select>
                <option value="Local">Local</option>
                <option value="Cloud">Cloud</option>
            </select>
            <label>Cloud Address</label>
            <input type="text"></input>
            <label>App ID</label>
            <input type="text"></input>
            <label>API Key</label>
            <input type="text"></input>
            <div className='configFormBtns'>
                <Button text="Cancel" onClick={props.onCancel} style={{background: 'white', color: 'black'}}/>
                <Button text="Submit"/>
            </div>
        </form>
    )
}

export default NewConfigForm