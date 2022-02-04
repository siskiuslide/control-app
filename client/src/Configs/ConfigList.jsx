import React from 'react';
import Config from './Config';
import './ConfigList.css'

const ConfigList = props =>{
    const {configs} = props
    return(
        <div className="configListContainer">
            <h1>Network list</h1>
            {configs.map(conf=>{
                return <Config name={conf.name} type={conf.type} appID={conf.appID} favourite={conf.favourite} key={Math.random()}/>
            })}
        </div>
    )
}

export default ConfigList