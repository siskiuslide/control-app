import React, { useEffect, useState } from 'react';
import Navbar from '../UI/Navbar';
import Selection from '../UI/Selection'

import ConfigQuickList from '../Devices/ConfigQuickList'
import DevicesList from '../Devices/DevicesList'

import './DevicesPage.css'

const DevicesPage = (props)=>{
    const [configs, setConfigsList] = useState([])
    const [devices, setDevicesList] = useState([])
    const [activeConfig, setActiveConfig] = useState('')

    //configs req 
    useEffect(()=>{  
       fetch("/config")
            .then((res) => {
                if(res.status === 401){throw new Error('Login to access your networks')}
                return res.json()})
            .then((data) => {setConfigsList(data.body);})
            .catch(err=>console.log(err));
        }, [])

        
    useEffect(()=>{
        fetch(`/config/${window.localStorage.getItem('activeNetwork')}/devices`)
             .then((res)=>{
                 if(res.status === 401){throw new Error('Login to access your networks')}
                 return res.json()
            })      
            .then((data)=>{ 
                setDevicesList(data.data)
            })
             .catch(err=>{console.log(err)})
    },[])
    

    const updateDeviceState = (e)=>{
        const target = e.target.closest('.DeviceCard').id
        const targetDevice = devices.find(dev=>{ return dev._id === target})
        console.log(targetDevice)
        

    }

    return(
        <>
            <Navbar></Navbar>
            <div className='DevicesPage' style={props.pageWidth < 900 ? {flexDirection: 'column'}:{flexDirection: 'row'} }>
                {props.pageWidth > 900 && <ConfigQuickList configs={configs} />}
                {/* {props.pageWidth < 900 && <Selection options={configs} />} */}
                <DevicesList activeConfig={window.localStorage.getItem('activeNetwork')} devices={devices} updateDeviceState={updateDeviceState}/>
            </div>
        </>
    )
} 

export default DevicesPage