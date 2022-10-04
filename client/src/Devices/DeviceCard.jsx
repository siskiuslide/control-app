import React, {useState} from 'react'
import './DeviceCard.css'

const DeviceCard = (props)=>{
    const { device } = props

    const selectIconType = (device)=>{
        if(
        device.label.includes('light')||
        device.label.includes('Light') || 
        device.label.includes('Bulb') || 
        device.label.includes('bulb') || 
        device.label.includes('strip') || 
        device.label.includes('Strip')){
            return 'lightbulb'}

        if(
        device.label.includes('heating')||
        device.label.includes('Heating')){
            return 'local_fire_department'}

        else{
            return 'bolt'
        }
    }


    const selectOutline = (status) =>{
       return status == 'on' ? 'material-icons' : 'material-icons-outlined'
       
    
    }
    return (
        <>
            <div className="DeviceCard">
                <div className="cardHeader">
                </div>
                <div className="cardBody">
                    <span className={'cardButton material-icons'} onClick={props.updateDeviceState}>{selectIconType(device)}</span>
                </div>
                <div className="cardFooter">
                    <h1 className="cardLabel">{device.label}</h1> 
                </div>
            </div>
        </>
    )
}

export default DeviceCard