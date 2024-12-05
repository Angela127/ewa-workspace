import React from 'react'
import { auth } from "../firebase"; // Import your Firebase instance

const Navbar = () =>{
    const currentUser = auth.currentUser;
    return (
        <div className='navbar'>
        <span className="logo">Ewa Chat</span>
        <div className="user">
        <img src={currentUser?.photoURL || "/images/ewa.png"} alt="User Avatar" />
        <span>{currentUser?.displayName || "Anonymous"}</span>

        </div>
        </div>
    )
}

export default Navbar;