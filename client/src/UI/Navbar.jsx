import React from 'react'
import './Navbar.css'
const Navbar = props =>{
    return(
    <nav>
        <ul className="nav-list">
            <li className="nav-item">About</li>
            <li className="nav-item">Networks</li>
            <li className="nav-item">Devices</li>
            <li className="nav-item">Sharing</li>
        </ul>
        <ul className="login-section">
            <li>x</li>
        </ul>
    </nav>
    )
}
export default Navbar