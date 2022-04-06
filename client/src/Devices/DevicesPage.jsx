import React, { useEffect, useState } from 'react';
import Navbar from '../UI/Navbar';

import ConfigQuickList from '../Devices/ConfigQuickList'
import DevicesList from '../Devices/DevicesList'

import './DevicesPage.css'

const DevicesPage = (props)=>{
    const [configs, setConfigsList] = useState()
    const [devices, setDevicesList] = useState()
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

        
    useEffect(()=>{
        const request = fetch(`/config/${window.localStorage.getItem('activeNetwork')}/devices`)
             .then((res)=>{
                 if(res.status === 401){throw new Error('Login to access your networks')}
                 return res.json()
            })      
            .then((data)=>{ 
                setDevicesList(data.data)
            })
             .catch(err=>{console.log(err)})
    },[])
    

    return(
        <>
            <Navbar></Navbar>
            <div className='DevicesPage'>
                <ConfigQuickList configs={configs}/>
                <DevicesList activeConfig={window.localStorage.getItem('activeNetwork')} devices={devices}/>
            </div>
        </>
    )
} 

export default DevicesPage