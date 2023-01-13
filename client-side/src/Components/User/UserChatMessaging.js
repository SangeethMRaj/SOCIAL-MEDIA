import axios from '../Instance/AxiosInstance';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'timeago.js'

function UserChatMessaging({ message, own, pic }) {
    const navigate = useNavigate()
    const [profilepic, setProfilePic] = useState([])
    const Id = message.senderId
    useEffect(() => {
        try {
            if (!own) {
                axios.get("/chatusers/" + Id, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response) => {
                    setProfilePic(response.data.Images)
                })

            }
        } catch (err) {
            navigate('/error')
        }

    }, [])
    return (
        <div>
            <div class="flex flex-col h-full  mb-4">
                <div class="flex flex-col h-full">
                    <div class="grid grid-cols-12 gap-y-2">

                        {own ? <div class="col-start-6 col-end-13 p-3 rounded-lg">
                            <div class="flex items-center justify-start flex-row-reverse">
                                <div
                                    class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                >
                                    {pic ? <img className='rounded-full' src={`${axios.images}/${pic}`} />
                                        : <img className='rounded-full' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' />
                                    }
                                </div>
                                <div
                                    class=" mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                >
                                    <div>{message.text}</div>

                                </div>

                            </div>
                            <div className='w-full justify-items-end'>
                                <p className='text-xs  text-gray-500 text-right  w-full'>{format(message.createdAt)}</p>
                            </div>
                        </div>
                            :
                            <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                <div class="flex flex-row items-center">
                                    <div
                                        class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                                    >
                                        {profilepic ? <img className='rounded-full w-10 h-10' src={`${axios.images}/${profilepic}`} />
                                            : <img className='rounded-full w-10 h-10' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' />
                                        }
                                    </div>
                                    <div
                                        class=" ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                                    >
                                        <div>{message.text}</div>
                                    </div>
                                </div>
                                <div className='w-full '>
                                    <p className='text-xs  text-gray-500 w-full'>{format(message.createdAt)}</p>
                                </div>
                            </div>

                        }


                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserChatMessaging
