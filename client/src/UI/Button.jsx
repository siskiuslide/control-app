import React from 'react';
import './Button.css'

const Button = props =>{
    const {text} = props
    return (
        <button className="button" onClick={props.onClick} style={props.style}>{text}</button>
    )
}

export default Button