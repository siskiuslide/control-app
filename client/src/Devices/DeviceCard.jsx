import React, {useState} from 'react'

const DeviceCard = (props)=>{
    const { favourite, label, type, status } = props
    return (
        <>
            <div className="DeviceCard">
                <h1 className="cardLabel">{label}</h1>
            </div>
        </>
    )
}

export default DeviceCard