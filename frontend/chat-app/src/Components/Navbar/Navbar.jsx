import React from 'react'
import './Navbar.css'
import { useApi } from '../../contexts/context'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = ({setProfileActive}) => {
    const navigate = useNavigate();
    const {baseURL} = useApi();
    const myId = localStorage.getItem("userId")
    
    const handleLogout = async()=>{
       const response = await axios.post(`${baseURL}/logout`,{myId},{withCredentials:true})
       if(response.data.success)
       {
          localStorage.removeItem('userId')
          toast.success("Logout Successfully")
          navigate('/login')
       }
    }
  return (
    <div className='navbar-container'>
     <div className='left-items'>
        <h2>Lets Chat</h2>
     </div>
     <div className='right-items'>
         <div>Settings</div>
         <div onClick={()=>{setProfileActive(true)}} >Profile</div>
         <div onClick={()=>{handleLogout()}}>Logout</div>
     </div>
    </div>
  )
}

export default Navbar
