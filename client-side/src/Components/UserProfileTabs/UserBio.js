import axios from '../Instance/AxiosInstance'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Pages/Context/Context'
import { GoVerified } from 'react-icons/go'
import Swal from 'sweetalert2'


function UserBio() {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [userDetails, setUserDetails] = useState([])
    const [following, setfFollowing] = useState()
    const [followers, setFollowers] = useState()
    const [postCount, setPostCount] = useState()
    const [followersModal, setFollowersModal] = useState(false)
    const [followersLists, setFollowersLists] = useState([])
    const [followingModal, setFollowingModal] = useState(false)
    const [followingLists, setFollowingLists] = useState([])
    const [followUser, setFollowUser] = useState([])
    const [viewAllFollowing, setViewAllFollowing] = useState([])

    const follow = (fid) => {
        const userId = user.id
        const friendId = fid
        try {
            const id = { userId, friendId }
            axios.post("/follow", id, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                if (response.data.msg == "follow") {
                    setFollowUser(response.data.msg)
                } else {
                    setFollowUser(response.data.msg)
                }
            })

        } catch (err) {
            navigate('/error')
        }
    }

    useEffect(() => {
        const userId = user.id
        axios.get("/viewallfollowing/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log(response.data, 'array for');
            setViewAllFollowing(response.data)
        }).catch((err)=>{
            navigate('/error')
        })
    }, [followUser])
    useEffect(() => {
        try {
            const userId = user.id
            axios.get("/viewprofiledetails/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setUserDetails(response.data)
            }).catch((err)=>{
          navigate('/error')
      })

        } catch (err) {
            navigate('/error')
        }
    }, [])

    useEffect(() => {
        try {
            const userId = user.id
            axios.get("/followingcount/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setfFollowing(response.data.count.following)
                setFollowers(response.data.count.followers)
            })

        } catch (err) {
            navigate('error')
        }
    }, [followUser])

    useEffect(() => {
        try {
            const userId = user.id
            axios.get("/postcount/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setPostCount(response.data.count)
            })

        } catch (err) {
            navigate('/error')
        }
    }, [])

    const followersList = () => {
        try {
            const userId = user.id
            axios.get("/followerslist/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setFollowersLists(response.data)
                setFollowersModal(true)
            })

        } catch (err) {
            navigate('/error')
        }
    }

    const followingList = async (id) => {
        const userId = user.id
        console.log(userId, 'in bio');
        await axios.get("/followinglist/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            console.log(response.data, 'response in followerslist');
            setFollowingLists(response.data)
            setFollowingModal(true)
        }).catch((err)=>{
            navigate('/error')
        })
    }

    const verification = async () => {
        Swal.fire({
            title: "Verification",
            text: "Sent request to get the account verified",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton:true
          }).then((result)=>{
            if(result.isConfirmed){
                try{
                    const userId = userDetails[0]._id
                    console.log(userId);
                     axios.post("/applyverification", userId, {
                        headers: {
                            "x-access-token": localStorage.getItem("token"),
                        },
                    })

                }catch(err){
                    navigate('/error')
                }
                
            }
          })

    }
    console.log(followers);

    return (
        <div>
            <div class="max-w-2xl mx-auto mt-2">



                {followersModal && <div id="popup-modal" class="overflow-y-auto mx-auto  fixed top-0 right-0 left-0 z-50  h-modal md:h-full mt-48  justify-center items-center" >
                    <div class="relative mx-auto mt-3  max-w-sm h-full ">
                        <div class="relative bg-white h-fit rounded-lg shadow ">
                            <button onClick={() => {
                                setFollowersModal(false)

                            }} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="p-4 text-center">
                                <div>
                                    <h1 className='font-bold mb-2'>Followers List</h1>
                                    <hr />
                                    <div className='h-full max-h-80 overflow-y-scroll'>
                                        {
                                            followersLists.map((followerlist, index) => (

                                                <div className='flex h-16 cursor-pointer w-full' >

                                                    <div class="my-auto p-2" >
                                                        <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80" class="rounded-full w-10 h-10" alt="profile picture" srcset="" />
                                                    </div>
                                                    <h1 className='my-auto ml-2 text-lg'>{followerlist.list.username}</h1>
                                                    <div className='my-auto ml-auto'>
                                                        {viewAllFollowing.following.includes(followerlist.list._id) ? <button className='bg-white border border-gray-500 px-4 py-1 rounded-2xl mr-auto shadow-lg hover:shadow' onClick={() => {
                                                            follow(followerlist.list._id)
                                                        }}>Following</button>
                                                            : <button className='bg-white border border-gray-500 px-4 py-1 rounded-2xl mr-auto shadow-lg hover:shadow' onClick={() => {
                                                                follow(followerlist.list._id)
                                                            }}>Follow</button>
                                                        }
                                                    </div>

                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>}

                {followingModal && <div id="popup-modal" class="overflow-y-auto mx-auto  fixed top-0 right-0 left-0 z-50  h-modal md:h-full mt-48  justify-center items-center" >
                    <div class="relative mx-auto mt-3  max-w-sm h-full ">
                        <div class="relative bg-white h-fit rounded-lg shadow ">
                            <button onClick={() => {
                                setFollowingModal(false)

                            }} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="p-4 text-center">
                                <div>
                                    <h1 className='font-bold mb-2'>Following List</h1>
                                    <hr />
                                    <div className='h-full max-h-80 overflow-y-scroll'>
                                        {
                                            followingLists.map((followerlist, index) => (

                                                <div className='flex h-16 cursor-pointer w-full' >

                                                    <div class="my-auto p-2" >
                                                        <img src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80" class="rounded-full w-10 h-10" alt="profile picture" srcset="" />
                                                    </div>
                                                    <h1 className='my-auto ml-2 text-lg'>{followerlist.list.username}</h1>
                                                    <div className='my-auto ml-auto'>
                                                        {viewAllFollowing.following.includes(followerlist.list._id) ? <button className='bg-white border border-gray-500 px-4 py-1 rounded-2xl mr-auto shadow-lg hover:shadow' onClick={() => {
                                                            follow(followerlist.list._id)
                                                        }}>Following</button>
                                                            : <button className='bg-white border border-gray-500 px-4 py-1 rounded-2xl mr-auto shadow-lg hover:shadow' onClick={() => {
                                                                follow(followerlist.list._id)
                                                            }}>Follow</button>
                                                        }
                                                    </div>

                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>}

                <div class="px-3 py-2">
                    {
                        userDetails.map((item, index) => (


                            <div>

                                <div class="gap-1 text-center ">
                                    {userDetails[0].Images ? <img class="p-1 mx-auto  w-28 justify-content-center h-28 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src={`${axios.images}/${userDetails[0].Images}`} alt="Bordered avatar" />
                                        : <img class="p-1 mx-auto  w-28 justify-content-center h-28 rounded-full ring-2 ring-gray-300 dark:ring-gray-500" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' alt="Bordered avatar" />}
                                    <div className='flex justify-center'>
                                        <p class="font-serif font-semibold text-lg">{userDetails[0].username}</p>
                                        <h1>
                                            {userDetails[0].verification && <GoVerified color='blue' className='mt-1 ml-1' />}

                                        </h1>
                                    </div>

                                    <h1 class=" text-gray-400">{userDetails[0].career}</h1>
                                    <h1 class="italic">{userDetails[0].bio}</h1>
                                </div>



                                <div class="flex justify-center items-center gap-2 my-3 cursor-pointer">
                                    <div class="font-semibold text-center mx-4">
                                        <p class="text-black">{postCount}</p>
                                        <span class="text-gray-400 cursor-pointer">Posts</span>
                                    </div>
                                    <div class="font-semibold text-center mx-4" onClick={followersList}>
                                        <p class="text-black">{followers}</p>
                                        <span class="text-gray-400">Followers</span>
                                    </div>
                                    <div class="font-semibold text-center mx-4" onClick={followingList}>
                                        <p class="text-black">{following}</p>
                                        <span class="text-gray-400">Following</span>
                                    </div>
                                </div>
                            </div>

                        ))}

                    <div class="flex justify-center gap-2 my-5">
                        {/* <button class="bg-pink-500 px-10 py-2 rounded-full text-white shadow-lg">Follow</button> */}
                        <button class="bg-white border border-gray-500 px-10 py-2 rounded-full shadow-lg hover:shadow" onClick={() => {
                            navigate('/user/editprofile')
                        }} >Edit Profile</button>

                        {followers>5 && userDetails[0].verification==false && <button class="bg-white border border-gray-500 px-10 py-2 rounded-full shadow-lg hover:shadow" onClick={verification}>Apply verification</button>}
                    </div>





                    <div class="flex justify-between items-center">
                        <button onClick={() => { navigate('/user/profile/posts') }} class="w-full py-2 border-b-2 border-black">
                            Posts
                        </button>
                        {/* <button onClick={()=>navigate('/user/profile/saved')} class="w-full py-2 border-b-2 border-black">
            Saved
        </button> */}
                    </div>




                </div>
            </div>
        </div>
    )
}

export default UserBio
