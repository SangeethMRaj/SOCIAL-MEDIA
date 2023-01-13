import axios from '../Instance/AxiosInstance'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ChatUsersList({ conversation, currentuser }) {
    const navigate = useNavigate()
    const [users, setUser] = useState(null)

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentuser.id)
        // const getUser = ()=>{
        try {
            axios.get("/chatusers/" + friendId, {
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            }).then((res) => {

                setUser(res.data)
            })
        } catch (err) {
            navigate('/error')
        }
        // }
        // getUser(); 
    }, [currentuser, conversation])
    return (
        <div>
            <div class=" md:flex  space-y-1 mt-4 -mx-2 w-24 md:w-auto md:overflow-y-auto">   
                <div>

                    {users && users.Images ? <img src={`${axios.images}/${users.Images}`} alt="" className='w-10 h-10 mx-auto rounded-full cursor-pointer' />
                        : <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' alt="" className='w-10 h-10 mx-auto rounded-full cursor-pointer' />
                    }
                </div>
                <div class="md:ml-2 md:pt-2 text-center md:w-auto text-sm font-semibold cursor-pointer">{users && users.username}</div>
            </div>
            <hr className='mt-2' />
        </div>
    )
}

export default ChatUsersList
