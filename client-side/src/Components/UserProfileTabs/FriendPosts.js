import axios from '../Instance/AxiosInstance';
import React,{useEffect,useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import CommentModal from '../Modal/CommentModal';

function FriendPosts() {
    const detailsUser = useLocation().state
    const [posts,setPosts] = useState([])
    const [commentModal, setCommentModal] = useState(false)
    const [eachPost, setEachPost] = useState([])
    const id = detailsUser._id
    const navigate = useNavigate()
    
    useEffect(()=>{
        axios.get("/viewprofilepost/" +id,{
          headers: {
              "x-access-token": localStorage.getItem("token"),
          },
      }).then((response)=>{
            setPosts(response.data)
        }).catch((err)=>{
          navigate('/error')
      })
    })

    const viewPost = (postId) => {
      console.log(postId, 'id in comment click');
      axios.get("/postdetails/" + postId,{
        headers: {
            "x-access-token": localStorage.getItem("token"),
        },
    }).then((response) => {
          setCommentModal(!commentModal)
          setEachPost(response.data)
      }).catch((err)=>{
        navigate('/error')
    })
    
  }
  return (
    <div>

            
      <div className='px-3 py-2 max-w-2xl  mx-auto mt-2'>
            <div class="grid grid-cols-3 gap-2 my-3">
        {
            posts.map((item,index)=>(
              <img class="block bg-center bg-no-repeat bg-cover h-40 w-60 rounded-lg" src={`${axios.images}/${item.Images}`} alt='' onClick={()=>{
                viewPost(item._id)
              }}/>

              ))}
            </div>
          </div>

          <div>
                {commentModal&&

                    <CommentModal eachPost={eachPost} />
                }


            </div>
    </div>
  )
}

export default FriendPosts
