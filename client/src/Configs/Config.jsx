import React from 'react';
import './Config.css'

const Config = props =>{
    const {name, type} = props
    return(
        <div class="config">
            <span className="material-icons">{type==="cloud"? 'cloud' : 'network_ping'}</span>
            <h3>{name}</h3>
            <p>{type}</p>
            <p>Lorem</p>    
        </div>
    )
}


export default Config