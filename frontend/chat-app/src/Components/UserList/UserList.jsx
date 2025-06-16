import React from 'react'
import './UserList.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useApi } from '../../contexts/context'
import onlineDot from '../../assets/Online_dot.jpg'

const UserList = ({ selfData,setParticularChat }) => {
    const [allUsers, setAllUsers] = useState([]);
    const { baseURL,onlineUsers } = useApi();
    const [active,setActive] = useState('');
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.post(`${baseURL}/access-all-users`, { selfId: selfData?._id }, { withCredentials: true })
                setAllUsers(response.data.allUsers);
            } catch (error) {

            }
        }
        fetchAllUsers();
    }, [selfData])

    return (

        <div className='userlist-container'>
            <h3>Contacts</h3>
            <div className='only-online-check'>
                <input type="checkbox" />
                <p>Show online only</p>
            </div>
            <div className='all-users-box'>
                {
                    allUsers?.map((user, index) => (
                        <div key={index} className={`particular-user ${active===user._id?'selectedUser':''}`} onClick={()=>{setParticularChat(user);setActive(user._id)}}>
                            <div className='allUser-image-container'>
                               <img src={user?.profileImage||''} alt="" />
                            {onlineUsers.includes(user._id) && <img className='Online-dot' src={onlineDot} alt="" />}
                            </div>
                            <div>
                                <h5>{user.name}</h5>
                                <p>{onlineUsers.includes(user._id)?'Online':'Offline'}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserList
