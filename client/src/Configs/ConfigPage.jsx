import React, { useEffect, useState } from 'react';
import Navbar from '../UI/Navbar';
import ConfigList from './ConfigList';
import NewConfigSection from './NewConfigSection';

import './ConfigPage.css'

const ConfigPage = props => {
    const [ configsList, setConfigsList ]=useState([
        {name: 'test network', type: 'cloud'},
        {name: 'upstairs', type: 'cloud'},
        {name: 'downstairs', type: 'local'},
    ])
    
    useEffect(()=>{
        // const configs = fetch('http://127.0.0.1:5500/config').then(res=>res.json()).catch(err=> console.log(err))
    })
  

    return (
        <>
        <Navbar /> 
        <div className="configPage">
            <ConfigList configs={configsList}/>
            <NewConfigSection/>
        </div>
        
        </>

    )
}

export default ConfigPage