import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AiFillDelete, AiOutlineClose, AiOutlineMore, AiOutlineSend } from 'react-icons/ai'
import { useContext } from 'react'
import { User, UserContext } from '../../Pages/Context/Context'
import { format } from 'timeago.js'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { IoMdHeart } from 'react-icons/io'

function CommentModal({ eachPost, viewPosts, socket }) {

    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const [comment, setComment] = useState('')
    const [caption, setCaption] = useState('')
    const [commentmodals, setCommentModals] = useState(true)
    const [getComment, setGetComment] = useState([])
    const [commentStatus, setCommentStatus] = useState('')
    const [option, setOption] = useState(false)
    const [edit, setEdit] = useState(false)
    const [username, setUsername] = useState([])

    console.log(eachPost, 'eachPost');

    useEffect(() => {
        const Id = eachPost.userId
        axios.get("http://localhost:4000/chatusers/" + Id, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setUsername(response.data.username)

        }).catch((err) => {
            navigate('/error')
        })
    }, [])

    const handleComment = (e) => {
        const { name, value } = e.target
        setComment({
            ...comment,
            [name]: value
        })
    }

    const handleCaption = (e) => {
        const { name, value } = e.target
        setCaption({
            ...caption,
            [name]: value
        })
    }

    const updateCaption = () => {
        const postId = eachPost._id
        axios.post("http://localhost:4000/editcaption/" + postId, caption, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setEdit(false)
            setCommentModals(false)
        }).catch((err) => {
            navigate('/error')
        })
    }

    const deletePost = () => {
        Swal.fire({
            title: "Delete Post",
            text: "Are you sure you want to delete the post?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {

                const postId = eachPost._id
                axios.delete("http://localhost:4000/deletepost/" + postId, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response) => {
                    setOption(false)
                    setCommentModals(false)
                    viewPosts()
                }).catch((err) => {
                    navigate('/error')
                })
            }
        })
    }

    const submitComment = (postId, type) => {
        const Images = eachPost.Images
        const userId = user.id
        const id = { userId, postId, comment }
        console.log(username, type, 'in comment modal');
        setComment('')
        if (comment) {

            axios.post("http://localhost:4000/comment", id, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setComment()
                setCommentStatus(response)
                socket?.emit("sendNotification", {
                    senderName: user?.name,
                    receiverName: username,
                    type,
                    image: Images
                })
            }).catch((err) => {
                navigate('/error')
            })
        }

    }

    const edits = () => {
        setEdit(true)
        setOption(false)
    }

    useEffect(() => {
        const postId = eachPost._id
        axios.get("http://localhost:4000/getcomment/" + postId, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setGetComment(response.data)
        }).catch((err) => {
            navigate('/error')
        })
    }, [commentStatus])

    const deleteComment = (Id) => {
        const commentId = Id
        const postId = eachPost._id
        const id = { commentId, postId }
        axios.post("http://localhost:4000/deletecomment", id, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response)=>{
            setCommentStatus(response)
        })
    }


    return (
        <div>
            {commentmodals && <div className='text-black absolute flex  justify-center items-center bottom-0 top-0 right-0  left-0 duration-1000  duration h-screen w-screen z-10'>
                <div className='text-black w-[60rem] bg-slate-200 h-[30rem] flex shadow-xl'>
                    <div className='w-1/2 '>


                        {<div className='w-full h-full flex justify-center items-center overflow-hidden '>
                            <img src={`/images/${eachPost.Images}`} className='' alt="Free unsplash image" />

                        </div>}


                    </div>
                    <div className='w-1/2 bg-white flex flex-col justify-between px-5 py-3'>
                        <div className='flex justify-between h-[3rem] ' >
                            <p className='text-main' >Comments</p>
                            {eachPost.userId === user.id && <AiOutlineMore className='w-5 hover:text-main  cursor-pointer' color='black' size='20px' onClick={() => setOption(true)} />}
                        </div>
                        {/* <div className=' flex items-center'>
                                <IoMdHeart className='w-5  cursor-pointer' /> <p className='text-[10px] pl-1'>24 likes</p>
                            </div> */}
                        <h1>{eachPost.caption}</h1>
                        <div className='h-full pt-5 pl-6 '>
                            <div className='h-[350px] overflow-y-scroll '>
                                {
                                    getComment.map((comment, index) => (
                                        <div className=' flex items-center gap-3 pb-4  ' >
                                            <div className='pb-1'>
                                                <div className='w-[2rem] rounded-full border-main border-[1px] bg-secondary h-[2rem]' >
                                                    {comment.commentList.Images ? <img className='w-[2rem] rounded-full border-main border-[1px] bg-secondary h-[2rem]' src={`/images/${comment.commentList.Images}`} alt="" /> :
                                                        <img className='w-[2rem] rounded-full border-main border-[1px] bg-secondary h-[2rem]' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' alt="" />
                                                    }
                                                </div>
                                            </div>

                                            <div className='w-full '><p className='text-black text-[12px]'><span className='text-black text-[12px] cursor-pointer font-bold'>{comment.commentList.username}</span> {comment.comment.comment}</p>

                                                <p className='text-main text-[10px] '>{format(comment.comment.time)}</p>
                                            </div>
                                            <div className='text-center flex'>

                                                <div onClick={() => deleteComment(comment.comment._id)}>
                                                    <AiFillDelete className='w-3 cursor-pointer' />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className='mt-2 flex'>
                                <input type="text" name='comment' className='bg-slate-200 w-full rounded-xl px-2 py-2 cursor-pointer' placeholder='Add a comment' onChange={handleComment} />
                                <div className='h-10 w-10 text-blue-500 p-2 ml-[-40px] cursor-pointer'>
                                    <AiOutlineSend color='black' size='20px' onClick={() => submitComment(eachPost._id, 2)} />
                                </div>
                            </div>



                        </div>
                    </div>
                    <AiOutlineClose className='w-5 hover:text-main  cursor-pointer' onClick={() => setCommentModals(false)} />
                </div>
            </div>}




            {option && <div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 backdrop-blur-sm z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                <div class="relative mx-auto mt-52 w-full max-w-sm h-full md:h-auto">
                    <div class="relative bg-slate-900 border-2 border-black  m-2 rounded-lg shadow-md ">
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={() => setOption(false)}>
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6 text-center w-full mt-4">

                            <h1 class=" text-xl font-normal cursor-pointer text-white   w-full m-3" onClick={edits}>Edit </h1>
                            <hr className='w-full' />
                            <h1 class=" text-xl font-normal cursor-pointer text-white   w-full m-3" onClick={deletePost}>Delete</h1>
                            {/* <hr /> */}
                            {/* <h1 class=" text-xl font-normal cursor-pointer text-red-400   w-full m-3">Report</h1> */}
                        </div>
                    </div>
                </div>
            </div>}










            {edit && <div className='text-black absolute flex  justify-center items-center bottom-0 top-0 right-0  left-0 duration-1000 backdrop-blur-sm duration h-screen w-screen z-10'>
                <div className='text-black w-[60rem] bg-slate-200 h-[30rem] flex shadow-xl'>
                    <div className='w-1/2 '>


                        {<div className='w-full h-full flex justify-center items-center overflow-hidden '>
                            <img src={`/images/${eachPost.Images}`} className='' alt="Free unsplash image" />

                        </div>}


                    </div>
                    <div className='w-1/2 bg-white flex flex-col justify-between px-5 py-3'>
                        <div className='flex justify-between h-[3rem] ' >
                            <p className='text-main' >Comments</p>
                            {/* {eachPost.userId === user.id && <AiOutlineMore className='w-5 hover:text-main  cursor-pointer' color='black' size='20px' onClick={() => setOption(true)} />} */}
                        </div>
                        {/* <div className=' flex items-center'>
                                <IoMdHeart className='w-5  cursor-pointer' /> <p className='text-[10px] pl-1'>24 likes</p>
                            </div> */}

                        <div className='h-full pt-5 pl-6 '>
                            <div className='h-[350px] overflow-y-scroll '>
                                <div class="pb-4">
                                    <label for="about" class="font-semibold text-gray-700 block pb-1">Caption :</label>
                                    <input id="caption" name='caption' class="rounded-md px-4 py-2 w-full outline outline-white text-slate-400" type="text" defaultValue={eachPost.caption} onChange={handleCaption} />
                                </div>

                                <button data-modal-toggle="popup-modal" type="button" class=" mx-auto text-white bg-blue-600 cursor-pointer focus:ring-4 focus:outline-none  focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-2" onClick={updateCaption}>
                                    Make Changes
                                </button>
                            </div>
                            <div className='mt-2 flex'>

                            </div>



                        </div>
                    </div>
                    <AiOutlineClose className='w-5 hover:text-main  cursor-pointer' onClick={() => setEdit(false)} />
                </div>
            </div>}



        </div>
    )
}

export default CommentModal
