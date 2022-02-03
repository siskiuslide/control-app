import React, { useEffect, useState } from 'react';
import Navbar from '../UI/Navbar';
import ConfigList from './ConfigList';

const ConfigPage = props => {
    const [configsList, setConfigsList]=useState()

    useEffect(()=>{
        // const configs = fetch('http://127.0.0.1:5500/config').then(res=>res.json()).catch(err=> console.log(err))
    })


    return (
        <>
        <Navbar /> 
        <ConfigList configs={configsList}/>
        </>

    )
}

export default ConfigPage