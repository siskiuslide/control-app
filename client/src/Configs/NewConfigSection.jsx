import React, {useState} from 'react';
import Button from '../UI/Button';
import NewConfigForm from './NewConfigForm'
import './NewConfigSection.css'

const NewConfigSection = props =>{
    const [addNew, setAddNew] = useState(false)

    const addConfigHandler = () =>{
        setAddNew(true)
        console.log(addNew)
    }
    return (
        <div className="NewConfigSection">
            {!addNew && <Button text={'Create new'} onClick={addConfigHandler}/> }
            {addNew && <NewConfigForm />}
        </div>
    )
}

export default NewConfigSection