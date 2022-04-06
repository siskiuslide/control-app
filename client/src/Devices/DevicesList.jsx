import React, {useState, useEffect} from "react";
import DeviceCard from './DeviceCard'

import './DevicesList.css'


const DevicesList = (props) =>{
    const {activeConfig, devices} = props

  

    return(
    <div className="deviceCardContainer">
        {devices && devices.map((dev)=>{return <DeviceCard device={dev} key={dev._id} updateDeviceState={props.updateDeviceState}/>})} 
        
    </div>
    )
// return (<></>)
}

export default DevicesList