import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import jwtdecode from 'jwt-decode'

function OnlineUsers({onlineUsers,currentId}) {
    const [friends,setFriends] = useState([])
    const [onlineFriends,setOnlineFriends] = useState([])
    const navigate = useNavigate()

    const user = jwtdecode(localStorage.getItem('token'))
    useEffect(()=>{
        const userId = user?.id
        axios.get("http://localhost:4000/followinglist/" + userId,{
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response)=>{
            console.log(response.data.list,'response');
            setFriends(response.data)
        }).catch((err)=>{
            navigate('/error')
        })
    },[currentId])
    
    useEffect(()=>{
        setOnlineFriends(friends.filter((f)=>onlineUsers.includes(f._id)))
    },[])
    console.log(friends,'friends');
    console.log(onlineUsers,'onlineusers');
    console.log(onlineFriends,'onlineFriends');
  return (
    <div>
      <section class="w-64 mx-auto bg-white rounded-2xl px-8 py-6">
                        <div class="flex items-center justify-between text-black text-bold px-10">
                            <h1 className='text-black font-bold   '>Active Friends</h1>
                        </div>
                        <br /><hr />
                        
                        {
                            onlineUsers.map((online)=>(
                                online.userId!==null &&

                                <div className='flex justify-content-center'>

                            {/* <div class="mt-6 w-fit">
                                <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80" class="rounded-full w-10 h-10" alt="profile picture" srcset="" />
                            </div> */}
                            <div>
                                <h1 className='mt-7 ml-2'>{online.name}</h1>
                            </div>
                            <div className='w-2 h-2 bg-green-600 rounded mt-9 ml-2'>

                            </div>
                        </div>
                                    ))}
                     


                    </section>
    </div>
  )
}

export default OnlineUsers
