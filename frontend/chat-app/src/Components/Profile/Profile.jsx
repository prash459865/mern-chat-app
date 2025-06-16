import React, { useRef, useState } from 'react'
import './Profile.css'
import axios from 'axios';
import { useApi } from '../../contexts/context';
import { FaCamera } from "react-icons/fa";
import toast from 'react-hot-toast';

const Profile = ({ setProfileActive, selfData }) => {
    const profileImagePicker = useRef();
    const { baseURL } = useApi();
    const [name, setName] = useState(selfData?.name);
    const [email, setEmail] = useState(selfData?.email);
    const [profileImage, setProfileImage] = useState('')
    console.log(profileImage,"from image")



    const handleChangeImage = async () => {
        const formData = new FormData()
        formData.append('profileImage', profileImage);
        formData.append('selfId', selfData._id);
        formData.append('name', name);
        formData.append('email', email)
        try {
            const response = await axios.post(`${baseURL}/update-profile-image`, formData, { withCredentials: true })
            toast.success(response.data.message)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error)
                toast.error(response.data.error)
        }
    }
    return (
        <div className='profile-container'>
            <div onClick={() => { setProfileActive(false) }} className='cross-button'>❌</div>
            <h2>Profile</h2>
            <div className='self-image'>
                <div className='image-container'>
                    <img src={profileImage?URL.createObjectURL(profileImage):selfData?.profileImage} alt="" />
                </div>
                <input ref={profileImagePicker} type="file" style={{ display: 'none' }} onChange={(e) => { setProfileImage(e.target.files[0]) }} />
                <FaCamera onClick={() => profileImagePicker.current.click()} title='Click to change Image' className='camera' size={30} color='black' />
            </div>


            <label>Name <input type="text" value={name} placeholder='Name' onChange={(e) => { setName(e.target.value) }} /></label>
            <label>Email <input type="text" value={email} placeholder='Email' onChange={() => { setEmail(e.target.value) }} /></label>
            <button className='save-button' onClick={() => { handleChangeImage() }}>Save</button>

            <p>Member Since: {selfData.createdAt.slice(0, 10)} </p>
        </div>
    )
}

export default Profile
