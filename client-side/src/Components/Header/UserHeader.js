import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useContext } from 'react'
import {
    FaUserAlt,
    FaHome,
    FaFacebookMessenger,
    FaUserFriends,
    FaSearch
} from 'react-icons/fa'
import {
    IoMdAddCircle,
    IoMdNotifications
} from "react-icons/io";
import '../Header/Userheader.css'
import { UserContext } from '../../Pages/Context/Context'
import jwtdecode from 'jwt-decode'
import {io} from "socket.io-client"


function UserHeader({socket}) {
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext)
    const [modal, setModal] = useState(false)
    const [searchUser, setSearchUser] = useState([])
    const [notifications,setNotifications] = useState([])
    const [notify,setNotify] = useState(false)
    const [showProfile,setShowProfile] = useState(false)
    console.log(socket,'socket in navbar');
  useEffect(()=>{
    socket?.on("getNotification",data=>{
        setNotifications((prev)=>[...prev,data])
    })
  },[socket])
 console.log(notifications,'notifications');
    // const logout = () => {
    //     Swal.fire({
    //         title: "Logout",
    //         text: "Are you sure you want to logout?",
    //         icon: "success",
    //         confirmButtonText: "OK",
    //         showCancelButton: true
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             navigate('/')
    //         }
    //     })
    // }

    const handleChange = async (e) => {
        try{
            let userDetails = e.target.value
            if (e.target.value) {
                setModal(true)
            } else {
                setModal(false)
            }
            axios.get("http://localhost:4000/searchuser/" + userDetails,{
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((result) => {
                setSearchUser(result.data)
            })

        }catch(err){
            navigate('/error')
        }
    }
    const goToProfile = () =>{
        setShowProfile(false)
        navigate('/user/profile/posts')
    }
    
    useEffect(() => {
        setUser(jwtdecode(localStorage.getItem('token')))
    }, [])

    const displayNotification = ({senderName,type,image})=>{
        let action;
        if(type===1){
            action="liked"
        }else {
            action="commented"
        }

        return(
            <div className='flex mt-4'>
                <h1 class=" text-xl font-normal  text-black w-full"  >{`${senderName} ${action} your post`}</h1>
               <img className='ml-4 w-14 h-10'  src={`/images/${image}`}/>
            </div>
        )


    }

    const logout = () => {
        Swal.fire({
            title: "Logout",
            text: "Are you sure you want to logout?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/')
                localStorage.removeItem("token")
            }
        }).catch((err)=>{
            navigate('/error')
        })
    }


    return (

        <div >

            <nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5   dark:bg-gray-900 w-full sticky">
                <div class="container flex flex-wrap justify-between items-center mx-auto">
                    <a href="" class="flex items-center">
                        {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeJzKpieR2DLGDhPNKdD1GAhQfaaxmkHbTMQ&usqp=CAU" class="mr-3 h-6 sm:h-9" alt="" /> */}
                        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white" onClick={()=>navigate('/user/home')}>Xplore</span>
                    </a>

                    <div className='pl-32  sm:flex '>
                        <input type="search" placeholder='Search' name='search' autocomplete="off" className='px-2 py-2 rounded-md' onChange={handleChange} />
                        {/* <button className='bg-slate-700 text-white px-4 py-2 rounded-md'><FaSearch /></button> */}
                    </div>
                    <div class=" w-full md:block md:w-auto" id="navbar-default">
                        <ul class="flex  p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 justify-evenly">
                            <li>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" onClick={() => navigate('/user/home')}><FaHome size="20px" /></a>
                            </li>
                            {/* <li>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" onClick={() => { navigate('/user/findfriends') }}><FaUserFriends size="20px" /></a>
                            </li> */}
                            {/* <li>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" ><IoMdAddCircle size="20px" /></a>
                            </li> */}
                            <li className='flex'>
                                <div>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" onClick={() => { navigate('/user/message') }}><FaFacebookMessenger size="20px" /></a>
                                </div>
                                {/* <div className='text-white text-xs ml-[-10px] bg-red-600 w-4 h-4 rounded-full text-center'>5</div> */}
                            </li>
                            <li className='flex'>
                                <div onClick={()=>setNotify(!notify)}>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><IoMdNotifications size="25px" /></a>
                                </div>
                                {notifications.length>0 && <div className='text-white text-xs ml-[-15px] bg-red-600 w-4 h-4 rounded-full text-center'>{notifications.length}</div>}

                            </li>
                            <li>
                                <div className='relative'>

                                <div>
                                <a class="block py-2 pr-4 pl-3 cursor-pointer text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" onClick={() => setShowProfile(!showProfile)}><FaUserAlt size="20px" /></a>
                                </div>
            {showProfile && <div className='shadow p-4  bg-white absolute top-[3rem] z-40 rounded-lg '>
                            <ul>
                                <li className='flex items-center cursor-pointer py-1 text-gray-700' onClick={goToProfile}>Profile</li>
                                <li className='flex items-center cursor-pointer py-1 text-gray-700' onClick={logout}>Logout</li>
                            </ul>
                        </div> }
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>
                <i class="fab fa-wolf-pack-battalion"></i>
            </nav>




            {modal && <div id="popup-modal" class="overflow-y-auto mx-auto  fixed top-0 right-0 left-0 z-50  h-modal md:h-full mt-14  justify-center items-center" >
                <div class="relative mx-auto mt-3  max-w-sm h-full md:h-auto">
                    <div class="relative bg-white  rounded-lg shadow ">
                        <div class="p-8 text-center">
                            {
                                searchUser.map((item, index) => (
                                    <div onClick={() => {
                                        setModal(false)
                                    }}>
                                        <Link className='flex justify-content-center cursor-pointer' to={item._id == user.id ? '/user/profile/posts' : 'friendprofile'} state={item} >

                                            <div class="mt-3 w-fit" >
                                                {item.Images ? <img src={`/images/${item.Images}`} class="rounded-full w-10 h-10" alt="profile picture" srcset="" />
                                                :<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' class="rounded-full w-10 h-10" alt="profile picture" srcset="" />
                                                }
                                            </div>
                                            <div>
                                                <h1 className='mt-4 ml-6 text-lg'>{item.username}</h1>
                                            </div>

                                        </Link>
                                           
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>}

                            
            {notify&&<div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 mt-32 md:mt-20 right-0 left-0 z-50 md:inset-0  h-full justify-center items-center" aria-hidden="true">
                
                    <div class="absolute bg-white right-0 top-0 border-2 border-black  mr-4  md:mr-8 rounded-lg shadow-md ">
                        <h1 className='text-white mt-4 text-black text-2xl text-center px-auto' >Notifications</h1><hr className='border-black mt-2'/>
                        
                        {notifications.length!=0?<div class="p-6  w-full">
                            {
                                notifications.map((n)=>(
                                    displayNotification(n)
                                    
                                ))
                            }
                            
                           
                           
                        </div>:
                        <div class="p-6  w-full">
                            <h1>No Notifications are existing</h1>
                        </div>
                        }
                    </div>
            </div>}



        </div>
    )
}

export default UserHeader
