import React, { useState, useEffect, useReducer } from 'react'
import UserHeader from '../Header/UserHeader'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import axios from '../Instance/AxiosInstance'
import { useContext } from 'react'
import { User, UserContext } from '../../Pages/Context/Context'
import jwtdecode from 'jwt-decode'
import {
    IoMdHeart, IoMdHeartEmpty, IoMdPhotos,
} from 'react-icons/io'
import { useOutletContext } from 'react-router-dom'
import { BsChat } from 'react-icons/bs'
import { AiOutlineAim, AiOutlineCheckCircle, AiOutlineClose, AiOutlineDoubleRight, AiOutlineMore, AiOutlineSend } from 'react-icons/ai'
import CommentModal from '../Modal/CommentModal'
import OnlineUsers from './OnlineUsers'

function Userhome() {
    const socket = useOutletContext()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [modal, setModal] = useState(false)
    const [viewPost, setViewPost] = useState([])
    const [image, setImage] = useState()
    const [status, setStatus] = useReducer(x => x + 1, 0)
    const [form, setform] = useState({
        caption: '',
        Images: ''
    })
    const [commentModal, setCommentModal] = useState(false)
    const [eachPost, setEachPost] = useState([])
    const [comment, setComment] = useState('')
    const [getComment, setGetComment] = useState([])
    const [change, setChange] = useState('')
    const [reportModal, setReportModal] = useState(false)
    const [reportDetails, setReportDetails] = useState(false)
    const [reportThanks,setReportThanks] = useState(false)
    const [reportPostId,setReportPostId] = useState('')
    const [onlineUsers,setOnlineUsers] = useState([])

    if (user) {
        var userId = user.id
    }
    const socketio = require('socket.io-client')("ws://localhost:8000")
    const users = jwtdecode(localStorage.getItem('token'))
    useEffect(() => {
        socketio?.emit("addUser", users?.id,users?.name)
    }, [users.id])

    useEffect(()=>{
        socketio?.on("getUsers",(users)=>{
            setOnlineUsers(users)
        })
    })

    

    const likePost = (postId,username,type,images) => {
        
            const userId = user.id
            const id = { postId, userId }
            
           
            axios.post("/likepost", id, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setChange(response)
                socket?.emit("sendNotification",{
                    senderName:user?.name,
                    receiverName:username,
                    type,
                    image:images
                })
               
            }).catch((err)=>{
                console.log('error');
                navigate('/error')
            })
    }



    const UnlikePost = (postId,username,type) => {
            const userId = user.id
            const id = { postId, userId }
           
            axios.post("/likepost", id, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setChange(response)
               
               
            }).catch((err)=>{
                navigate('/error')
            })
    }



    useEffect(() => {
            axios.get("/viewpost", {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setViewPost(response.data)
            }).catch((err)=>{
                navigate('/error')
            })
    }, [change])
    console.log('dddd');
   

    const handleChange = (e) => {
        const { name, value } = e.target
        setform({
            ...form,
            [name]: value
        })
    }

    const fileUpload = (e) => {
        const image = e.target.files[0]
        setform({
            ...form,
            Images: image
        })
        setImage(URL.createObjectURL(e.target.files[0]))
    }

    const handleComment = (e) => {
        const { name, value } = e.target
        setComment({
            ...comment,
            [name]: value
        })
    }

    const authCheck = () => {
        axios.get("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log(response, 'response jwt');
            if (!response.data.auth) {
                navigate('/')
            }
        }).catch((err)=>{
            navigate('/error')
        })
    }
    useEffect(() => {
        authCheck()
    }, [])
    const addPost = () => {

            const Data = new FormData();
            for (let key in form) {
                Data.append(key, form[key])
            }
            Data.append('user', user.id)
            const { caption, Images } = form
            if (caption, Images) {
                axios.post("/addpost", Data, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response)=>{
                    setChange(response)
                    setModal(false)
                }).catch((err)=>{
                    navigate('/error')
                })
            }
    }



    const openModal = (postId) => {
        console.log(postId, 'id in comment click');
        axios.get("/postdetails/" + postId, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setCommentModal(!commentModal)
            setEachPost(response.data)
        }).catch((err)=>{
            navigate('/error')
        })
        // axios.get("/getcomment/"+postId,{
        //     headers: {
        //         "x-access-token": localStorage.getItem("token"),
        //     },
        // }).then((response)=>{
        //     setGetComment(response.data)
        // })
    }

    const submitComment = (postId) => {
        const userId = user.id
        const id = { userId, postId, comment }
        setComment('')
        axios.post("/comment", id, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        })

    }

    const reportClose = (postId) => {
        console.log(postId,'hey post id');
        setReportModal(!reportModal)
        setReportDetails(true)
        setReportPostId(postId)
    }

    const report = (text) =>{
        const userId = user.id
        console.log(reportPostId,userId,text,'check,check');
        const details = {reportPostId,userId}
        axios.post("/report/"+text,details, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response)=>{
            console.log(response.data.msg,'resssssss');
            if(response.data.msg==='reported'){
                setReportDetails(false)
                setReportThanks(true)
            }
        }).catch((err)=>{
            navigate('/error')
        })
    }
   
    console.log(viewPost, 'view post user id ');


    return (
        <div>


            <div className='flex  h-full w-screen bg-slate-200 p-2  justify-evenly'>
                <div className='grid md:grid-cols-1 h-max hidden lg:flex lg:w-content mt-4'>
                    <section class="w-content  bg-white rounded-2xl px-8 py-6">
                        <div class="flex items-center justify-between">

                        </div>
                        <div onClick={() => { navigate('/user/profile/posts') }} class="mt-6 w-fit cursor-pointer mx-auto">
                            {/* <img className='rounded-full' src="https://wallpapers.com/images/hd/cool-neon-blue-profile-picture-u9y9ydo971k9mdcf.jpg" class="rounded-full w-28 " alt="profile picture" srcset="" /> */}

                            <img class="p-1 w-28 h-28 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeJzKpieR2DLGDhPNKdD1GAhQfaaxmkHbTMQ&usqp=CAU" alt="Bordered avatar" />

                        </div>

                        <div class="mt-8 ">
                            {/* <h2 onClick={() => { navigate('/user/profile/posts') }} class="text-black cursor-pointer text-center font-bold text-2xl tracking-wide">alex</h2> */}
                        </div>
                        <hr className='my-5' />
                        <div>
                            <button onClick={() => navigate('/user/profile/posts')} className='p-2 bg-gray-900 w-max px-12 text-white' >
                                View Profile
                            </button>
                        </div>

                    </section>
                </div>

                {modal && <div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                    <div class="relative mx-auto mt-52 w-full max-w-md h-full md:h-auto">
                        <div class="relative bg-white border-2 border-black  m-2 rounded-lg shadow-md ">
                            <button onClick={() => {
                                setModal(!modal)
                                setImage('')
                            }} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="p-6 text-center w-full mt-4">
                                {image ? <img src={image} alt="" /> :
                                    <h1 class=" text-3xl font-normal underline text-gray-500 dark:text-gray-400  w-full m-3"><IoMdPhotos className='w-full h-36' /></h1>
                                }

                                <div className='px-auto flex flex-col mt-4'>

                                    <textarea
                                        id="caption-address" name="caption" type="text" placeholder="Add Caption to the post" onChange={handleChange} autocomplete="email" required class=" w-5/6 h-20 relative rounded-xl block w-full appearance-none  border border-gray-300 mx-auto py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />

                                    <label htmlFor="fileUpload" class="w-3/4 mx-auto text-center text-white bg-blue-600 cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm  px-5 py-2 mt-2">Upload Image</label>
                                    <input
                                        id="fileUpload" name="Images" type="file" placeholder="Company Name" onChange={fileUpload} autocomplete="email" required class="hidden w-5/6 h-10 bg-white relative rounded-xl block w-full appearance-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                                </div>
                                <button onClick={addPost} data-modal-toggle="popup-modal" type="button" class="text-white bg-blue-600 cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-2">
                                    Upload Post
                                </button>

                            </div>
                        </div>
                    </div>
                </div>}


                <div class="rounded-xl  border w-full lg:w-6/12 md:w-full bg-white  md:mx-0 lg:mx-0 mt-4">
                    <div onClick={() => setModal(!modal)} className='flex w-full h-12 bg-gray-900 cursor-pointer'>
                        <h1 class="mb-5 text-3xl font-normal underline text-gray-500 dark:text-gray-400 pl-0 sm:pl-52 pt-2"><IoMdPhotos size="30px" /></h1>
                        <h1 className='text-white px-auto pt-2 ml-2'>Upload your creativity and memories</h1>
                    </div>


                    <div className='max-h-screen overflow-y-scroll scrollbar-hide'>

                        {
                            viewPost.map((post, index) => (<>
                                <div class="w-content flex justify-between p-3">
                                    <div class="flex  justify-between w-full">
                                        <div className='flex'>
                                            <div class="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
                                                {post.userId.Images ? <img src={`${axios.images}/${post.userId.Images}`} alt="profilepic" />
                                                    : <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' alt="profilepic" />
                                                }
                                            </div>
                                            <span class="pt-1 ml-2 font-bold text-sm">{post.userId.username}</span>
                                        </div>
                                        <div className='cursor-pointer relative' >
                                            <div onClick={() => setReportModal(!reportModal)}>

                                                {post.userId._id !== user.id && <AiOutlineMore color='black' size='20px' />}
                                            </div>



                                            {reportModal && <div className="flex justify-center absolute top-10 right-0">
                                                <div className="block px-6 py-2 rounded-lg shadow-lg bg-white max-w-m">
                                                    <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2"></h5>
                                                    <p className="text-base mb-4 text-red-500 hover:cursor-pointer" onClick={()=>reportClose(post._id)}>
                                                        Report
                                                    </p>
                                                </div>
                                            </div>}

                                        </div>

                                        { reportDetails && <div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 backdrop-blur-sm z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                <div class="relative mx-auto mt-36 w-full max-w-sm h-full md:h-auto">
                    <div class="relative bg-white border-2 border-black  m-2 rounded-lg shadow-md ">
                        <h1 className='text-white mt-4 text-red-500 text-2xl text-center px-auto' >Report</h1><hr className='border-black mt-2'/>
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={()=>setReportDetails(false)}>
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6  w-full">

                            <h1 class=" text-xl font-normal text-center text-black w-full"  >Why are you reporting this post? </h1>
                            <div className='mt-4'>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('It is a scam')}>It is a scam</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('Violence or dangerous signal')}>Violence or dangerous signal</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('Sale of illegal goods')}>Sale of illegal goods</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('Bullying or harrassment')}>Bullying or harrassment</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('Suicide or life injury')}>Suicide or life injury</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('False information')}>False information</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('Fraud contents')}>Fraud contents</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('I just dont like this')}>I just dont like this</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>

                                


                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>}


            {reportThanks&&<div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 backdrop-blur-sm z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                <div class="relative mx-auto mt-36 w-full max-w-sm h-full md:h-auto">
                    <div class="relative bg-white border-2 border-black  m-2 rounded-lg shadow-md ">
                        <h1 className='text-white mt-4 text-green-500 text-2xl text-center px-auto'>Report Success</h1><hr className='border-black mt-2'/>
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={()=>setReportThanks(false)}>
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only" >Close modal</span>
                        </button>
                        <div class="p-6  w-full">
                
                            <AiOutlineCheckCircle color='green' size='100px' className='mx-auto'/>
                            <h1 class=" text-xl font-normal text-center text-black w-full">Thanks for letting us know</h1>
                            <p class=" text-sm font-normal text-center text-slate-500 w-full" >Your feedback is important in helping us keep the Xplore community safe.</p>
                            {/* <div className='mt-4'>
                                <div className='flex mt-4 w-full'>
                                    <div className='w-full'>
                            <h1 class=" text-lg font-normal cursor-pointer text-black w-full" onClick={()=>report('It is a scam')}>It is a scam</h1>
                                    </div>
                                    <AiOutlineDoubleRight className='mt-2 mr-0'/>
                                </div>
                              

                                


                            </div> */}
                           
                        </div>
                    </div>
                </div>
            </div>}





                                        {/* navbar */}
                                        {/* <div className='shadow sm:w-auto bg-white fixed bottom-[0] top-0 right-0 sm:bottom-auto sm:top-[4.3rem] w-[170px] z-40 rounded-lg sm:right-[4rem]'>
                            <ul>
                                <li className='sm:hidden  flex items-center justify-end cursor-pointer py-1 text-right text-gray-700' ><span className='mr-3 text-[12px]'>X</span></li>
                                <li className='flex hover:bg-gray-300 px-4 mt-4 items-center cursor-pointer py-1 text-gray-700' ><span className='mr-3 text-xl' ></span>Profile</li>
                                <li className='flex hover:bg-gray-300 px-4 items-center cursor-pointer py-1 text-gray-700'><span className='mr-3 text-xl'></span>Settings</li>
                                <li className='flex hover:bg-gray-300 px-4 mb-5  items-center cursor-pointer py-1 text-gray-700' ><span className='mr-3 text-xl'></span>Logout</li>
                            </ul>
                        </div> */}


                                    </div>
                                    {/* <span class="px-2 hover:bg-gray-300 cursor-pointer rounded"><i class="fas fa-ellipsis-h pt-2 text-lg"></i></span> */}
                                </div>
                                <img className="w-full bg-cover" src={`${axios.images}/${post.Images}`} />
                                <div class="px-3 pb-2">

                                    <div class="pt-2 flex cursor-pointer">
                                        <i class="far fa-heart cursor-pointer"></i>
                                        {/* <span class="text-sm text-gray-400 font-medium" onClick={() => likePost(post._id,post.userId.username,1)}>{post.likes.includes(userId) ? <IoMdHeart size='30px' color='red' /> : <IoMdHeartEmpty size="30px" color='black' />}</span> */}

                                        {post.likes.includes(userId) ? <span class="text-sm text-gray-400 font-medium" onClick={() => UnlikePost(post._id,post.userId.username,1)}><IoMdHeart size='30px' color='red' /></span>
                                        :<span class="text-sm text-gray-400 font-medium" onClick={() => likePost(post._id,post.userId.username,1,post.Images)}><IoMdHeartEmpty size="30px" color='black' /></span>
                                        }
                                        <span class="text-sm text-gray-400 font-medium ml-4 "><BsChat size="25px" color='black' onClick={() => openModal(post._id,2)} /></span>
                                    </div>

                             

                                    <h1 className='font-bold'>{post.likesCount} likes</h1>

                                    <div class="pt-1">

                                        <div class="mb-2 text-sm">
                                            <span class="font-bold mr-2">{post.userId.username} </span>{post.caption}
                                        </div>
                                    </div>

                                    <div class="text-sm mb-2 text-gray-400 cursor-pointer font-medium" onClick={() => openModal(post._id)}>View all comments</div>
                                    {/* <div class="mb-2">
                                        <div class="mb-2 text-sm">
                                            <span class="font-medium mr-2">razzle_dazzle</span> Dude! How cool! I went to New Zealand last summer and had a blast taking the tour! So much to see! Make sure you bring a good camera when you go!
                                        </div>
                                    </div> */}
                                </div><hr />
                            </>
                            ))}
                    </div>


                    {/* modal */}





                </div>




                <div className='grid md:grid-cols-1 h-max hidden md:flex mt-4'>
                    
                    <OnlineUsers onlineUsers={onlineUsers} currentId={user?.id}/>


                </div>


            </div>


           

            <div>

            </div>
            <div>
                {commentModal &&

                    <CommentModal eachPost={eachPost} socket={socket} />
                }


            </div>
        </div>



    )
}

export default Userhome
