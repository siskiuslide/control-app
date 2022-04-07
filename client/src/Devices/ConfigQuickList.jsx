import React from "react";
import Config from './../Configs/Config'
import './ConfigQuickList.css'
const ConfigQuickList = (props) =>{
    const {configs} = props
    console.log(configs)
    
    const setActiveNetwork = (e)=>{
        const ls = window.localStorage
        ls.setItem('activeNetwork', e.target.closest('.config').id)
        //set the activenetwork so when devices page loads it can select the network you pressed.
      }
    
    return(
        <div className="ConfigQuickList">
            {configs.length > 0 && configs.map(config=>{
                return( <Config key={config._id} name={config.name} type={config.type} favourite={config.favourite} smallFormat={true}/>)
            })}
        </div>
    )

}
export default ConfigQuickList