import React from 'react';
import Config from './Config';
import './ConfigList.css'

const ConfigList = props =>{
    const {configs} = props
    const setActiveConfig = (e) =>{
        window.localStorage.setItem('activeConfig', e.target.id)
    }
    return(
        <div className="configListContainer">
            {configs.map(conf=>{
                return <Config name={conf.name} type={conf.type} appID={conf.appID} favourite={conf.favourite} id={conf._id} key={conf._id} />
            })}
        </div>
    )
}

export default ConfigList