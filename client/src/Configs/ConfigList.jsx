import React from 'react';
import Config from './Config';
import './ConfigList.css'

const ConfigList = props =>{
    const {configs} = props
    console.log(configs)
    return(
        // configs.map(conf=>{
        //     <Config name={conf.name}/>
        // })
       <div className="configListContainer">
           <Config></Config>
           <Config></Config>
           <Config></Config>
       </div>
    )
}

export default ConfigList