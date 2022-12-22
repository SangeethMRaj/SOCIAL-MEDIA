import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { UserContext } from '../../Pages/Context/Context'
import CommentModal from '../Modal/CommentModal'
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

function UserPosts() {
  const [post, setPost] = useState()
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [profilePosts, setProfilePosts] = useState([])
  const [commentModal, setCommentModal] = useState(false)
  const [eachPost, setEachPost] = useState([])
  const [comment,setComment] = useState('')
  const [getComment,setGetComment] = useState([])

  useEffect(() => {
    viewPosts()
  },[])
  
  const viewPosts = () =>{
    const userId = user.id
    axios.get("http://localhost:4000/viewprofilepost/" + userId,{
      headers: {
          "x-access-token": localStorage.getItem("token"),
      },
  }).then((response) => {
      console.log(response,'response');
      setProfilePosts(response.data)
    }).catch((err) => {
      navigate('/error')
    })

  }

  const viewPost = (postId) => {
    console.log(postId, 'id in comment click');
    axios.get("http://localhost:4000/postdetails/" + postId,{
      headers: {
          "x-access-token": localStorage.getItem("token"),
      },
  }).then((response) => {
        setCommentModal(!commentModal)
        setEachPost(response.data)
    }).catch((err)=>{
      navigate('/error')
  })
    axios.get("http://localhost:4000/getcomment/"+postId,{
      headers: {
          "x-access-token": localStorage.getItem("token"),
      },
  }).then((response)=>{
        setGetComment(response.data)
    }).catch((err)=>{
      navigate('/error')
  })
}










  return (
    <div>
          <div className='px-3 py-2 max-w-2xl  mx-auto mt-2'>
            <div class="grid grid-cols-3 gap-2 my-3">
      {
        profilePosts.map((item, index) => (
              <img class="block bg-center bg-no-repeat bg-cover h-40 w-60 rounded-lg cursor-pointer" src={`/images/${item.Images}`} alt='' onClick={()=>{
                viewPost(item._id)
              }}/>

              ))}
            </div>
          </div>

          <div>
                {commentModal&&

                    <CommentModal eachPost={eachPost} viewPosts={viewPosts}/>
                }


            </div>
          
    </div>
  )
}

export default UserPosts
