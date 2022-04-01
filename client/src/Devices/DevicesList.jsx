import React, {useState, useEffect} from "react";


const DevicesList = (props) =>{
    const {activeConfig} = props

    const [devicesList, setDevicesList] = useState({})

    // devices req
    useEffect(()=>{
        const devices = fetch(`/devices/${activeConfig}`)
            .then((res)=>{
                if(res.status === 401){throw new Error('Login to access your networks')}
                return res.json()
            })      
            .then((data)=>{ 
                setDevicesList(data)
                console.log(data)
            })
            .catch(err=>{console.log(err)})
    },[])


    return(
        <></>
    // {devicesList.map(dev=>{
    //     <div>
    //         <h1>{dev.label}</h1>
    //     </div>
    // })}
    )
}

export default DevicesList