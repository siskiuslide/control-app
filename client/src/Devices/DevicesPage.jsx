import React, { useEffect, useState } from 'react';
import Navbar from '../UI/Navbar';

import ConfigQuickList from '../Devices/ConfigQuickList'
import DevicesList from '../Devices/DevicesList'

const DevicesPage = (props)=>{
    const [configs, setConfigsList] = useState()
    const [activeConfig, setActiveConfig] = useState('')

    //configs req 
    useEffect(()=>{  
        const configs = fetch("/config")
            .then((res) => {
                if(res.status === 401){throw new Error('Login to access your networks')}
                return res.json()})
            .then((data) => {setConfigsList(data.body);})
            .catch(err=>console.log(err));
        }, [])
    
    

    return(
        <>
            <Navbar></Navbar>
            <div className='DevicesPage'>
                <ConfigQuickList configs={configs}/>
                <DevicesList activeConfig={window.localStorage.getItem('activeNetwork')}/>
            </div>
        </>
    )
} 

export default DevicesPage