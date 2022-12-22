import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../Pages/Context/Context'
import ChatUsersList from './ChatUsersList'
import UserChatMessaging from './UserChatMessaging'
import jwtdecode from 'jwt-decode'
import { io } from "socket.io-client"
import { Navigate, useNavigate } from 'react-router-dom'

function UserChat({ socket }) {
    const [conversation, setConversation] = useState([])
    const navigate = useNavigate()
    // const { user } = useContext(UserContext)
    const user = jwtdecode(localStorage.getItem('token'))
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [arrivalMessage, setArrivalMessage] = useState(null)
    // const socket = useRef()
    const scrollRef = useRef()
    useEffect(() => {
        // socket? = io("ws://localhost:8000")
        socket?.on("getMessage", data => {
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        // socket?.emit("addUser", user?.id)
        socket?.on("getUsers", users => {
            console.log(users, 'users socket check');
        })
    }, [user])

    useEffect(() => {
        const userId = user.id
        try {
            axios.get("http://localhost:4000/conversation/" + userId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((res) => {

                setConversation(res.data)
            })
        } catch (err) {
            navigate('/error')
        }
    }, [user?.id])

    useEffect(() => {
        try {
            axios.get("http://localhost:4000/message/" + currentChat?._id, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((response) => {
                setMessages(response.data)
            })
        } catch (err) {
            navigate('/error')
        }
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            senderId: user.id,
            text: newMessage,
            conversationId: currentChat._id
        }
        const receiverId = currentChat.members.find(member => member !== user.id)

        socket?.emit("sendMessage", {
            senderId: user?.id,
            receiverId,
            text: newMessage
        })
        try {
            if (newMessage) {
                axios.post("http://localhost:4000/message", message, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                }).then((response) => {
                    setMessages([...messages, response.data])
                    setNewMessage('')
                })

            }
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <div>




            <div class="flex h-screen antialiased text-gray-800">
                <div class="md:flex  h-full w-full overflow-x-hidden">
                    <div class="flex flex-col py-8 pl-6 pr-2 w-full md:w-64 bg-white flex-shrink-0">
                        <div class="flex flex-row items-center justify-center h-12 w-full">

                            <div class="ml-2 font-bold text-2xl">XploreChat</div>
                        </div>
                        {/* <div class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
                            <div class="h-20 w-20 rounded-full border overflow-hidden">
                                <img
                                    src="https://avatars3.githubusercontent.com/u/2763884?s=128"
                                    alt="Avatar"
                                    class="h-full w-full"
                                />
                            </div>
                            <div class="text-sm font-semibold mt-2">Sangeeth M Raj</div>
                            <div class="text-xs text-gray-500">Moto enthusiasist</div>

                        </div> */}
                        <div class="flex md:flex-col md:mt-8">
                            {
                                conversation.map((userlist) => (
                                    <div onClick={() => setCurrentChat(userlist)}>

                                        <ChatUsersList conversation={userlist} currentuser={user} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>







                    <div class="flex flex-col flex-auto h-content p-6">
                        <div
                            class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                            {currentChat ?
                                <>
                                    <div class="flex flex-col h-full overflow-x-auto mb-4">
                                        {
                                            messages.map((m) => (
                                                <div ref={scrollRef}>

                                                    <UserChatMessaging message={m} own={m.senderId === user.id} pic={user.profilePic} />
                                                </div>
                                            ))
                                        }

                                    </div>
                                    <div
                                        class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">

                                        <div class="flex-grow ml-4">
                                            <div class="relative w-full">
                                                <input
                                                    type="text"
                                                    class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                                    placeholder='Enter your message...'
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    value={newMessage}
                                                />

                                            </div>
                                        </div>
                                        <div class="ml-4">
                                            <button
                                                class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                                                onClick={handleSubmit}
                                            >
                                                <span>Send</span>
                                                <span class="ml-2">
                                                    <svg
                                                        class="w-4 h-4 transform rotate-45 -mt-px"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                        ></path>
                                                    </svg>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                                : <span className='mx-auto my-auto text-4xl font-bold text-center'>Open a conversation to chat</span>
                            }
                        </div>
                    </div>
                </div>
            </div>




        </div>
    )
}

export default UserChat
