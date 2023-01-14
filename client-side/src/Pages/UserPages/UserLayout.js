import React, {useState,useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from '../../Components/Header/UserHeader'
import {io} from "socket.io-client"
import jwtdecode from 'jwt-decode'

function UserLayout() {
  const [socket,setSocket] = useState(null)
  const user = jwtdecode(localStorage.getItem('token'))
  console.log(user,'user user in header');
  useEffect(()=>{
    setSocket(io("https://xplre.online",{path:'/socketnotification/socket.io'}))
  },[])
  
  console.log(socket,'socket in navbar');
useEffect(()=>{
   socket?.emit("newUser",user?.name)
},[socket,user])
  return (
    <div>
      <div className='w-full'>
            <UserHeader socket={socket} />
            <div className='pt-32 sm:pt-32 md:pt-16 lg:pt-16' >
            <Outlet context={socket} />
            </div>
       
        </div>
    </div>
  )
}

export default UserLayout
