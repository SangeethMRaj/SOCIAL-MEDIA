import axios from '../../Components/Instance/AxiosInstance'
import React, { useEffect, useState } from 'react'

function Posts() {
  const [viewPost,setViewPost] = useState([])
  const [reportDetails,setReportDetails] = useState([])
  const [reportModal,setReportModal] = useState(false)
  const [reportInstant,setReportInstant] = useState(false)

  useEffect(()=>{
    axios.get("/admin/viewposts").then((response)=>{

      setViewPost(response.data)
    })
  },[reportInstant])

  const viewReportDetails = (Id) =>{
    console.log(Id);
    const postId = Id
    try{

      axios.get("/admin/reportdetails/"+postId).then((response)=>{
        setReportDetails(response.data)
        setReportModal(true)
      })
    }catch(err){
      console.log(err);
    }
  }

  const reportPost = (Id) =>{
    try{
      const postId = Id
      axios.post("/admin/reportpost/"+postId).then((response)=>{
        setReportInstant(!reportInstant)
      })
    }catch(err){
      console.log(err);
    }

  }

  const unReportPost = (Id)=>{
    try{
      const postId = Id
      axios.post("/admin/unreportpost/"+postId).then((response)=>{
        setReportInstant(!reportInstant)
      })
    }catch(err){
      console.log(err);
    }

  }
  console.log(viewPost);
  return (
    <div>
      <div class="overflow-x-auto h-96 relative rounded-md">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 scroll-table">
        <thead class="text-xs text-gray-700 uppercase colorclass dark:bg-gray-700 dark:text-gray-400">
        

            <tr>
            <th scope="col" class="py-3 px-6 text-center">
                    Sl.No
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                    Post
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                   User
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                    Report Count
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                    Report Details
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                    Action
                </th>
                {/* <th scope="col" class="py-3 px-6">
                    Block
                </th> */}
            </tr>
        </thead>
        <tbody>
          {
            viewPost.map((post,index)=>(


                <tr  class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700 colorclass item-center">
            <th scope="row" class="py-4 px-6 text-center font-medium colorclass whitespace-nowrap dark:text-white">
                    {index+1}
                </th>
                <th scope="row" class="py-4 px-6 item-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   <img src={`${axios.images}/${post.Images}`} className='w-14 h-14'  alt="" />
                </th>
                <td class="py-4 px-6 text-center text-white">
                  {post.userId.username}
                </td>
                <td class="py-4 px-6 text-center text-red-500 ">
                  {post.reportCount}
                </td>
                <td class="py-4 px-6 text-center">
                {post.reportCount===0?<button  className='bg-blue-600 approve ' onClick={()=>viewReportDetails(post._id)} disabled>View All</button>
                :<button  className='bg-blue-600 approve ' onClick={()=>viewReportDetails(post._id)}>View All</button>
                }
                </td>
                
             
               {post.reportStatus ?<td  class="py-4 px-6 text-center">
                <button  className='bg-red-600 approve' onClick={()=>reportPost(post._id)}>Report</button>
            </td>
            :
                
                
                <td  class="py-4 px-6 text-center">
                    <button onClick={()=>{
                        unReportPost(post._id)
                    }} className='bg-green-600 approve'>Cancel</button>
                </td>}

               
            </tr>
       
           
           ))
          }
            
        </tbody>
    </table>
</div>

{reportModal&&<div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 backdrop-blur-sm z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                <div class="relative mx-auto mt-36 w-full max-w-xl h-max md:h-auto">
                    <div class="relative bg-white border-2 border-black  m-2 rounded-lg shadow-md ">
                        <h1 className='text-white mt-4 text-red-500 text-2xl text-center px-auto' >Report Details</h1><hr className='border-black mt-2'/>
                        <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal" onClick={()=>setReportModal(false)}>
                            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6  w-full">

                           
                           



                      <div className='h-48 overflow-x-auto'>
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 scroll-table">
        <thead class="text-xs text-gray-700 uppercase colorclass dark:bg-gray-700 dark:text-gray-400">
        

            <tr>
            <th scope="col" class="py-3 px-6 text-center">
                    Sl.No
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                    User
                </th>
                <th scope="col" class="py-3 px-6 text-center">
                   Reason
                </th>
                
                {/* <th scope="col" class="py-3 px-6">
                    Block
                </th> */}
            </tr>
        </thead>
        <tbody>

                {
                  reportDetails.map((report,index)=>(

                 
                <tr  class="bg-white  border-b dark:bg-gray-800 dark:border-gray-700 colorclass item-center">
            <th scope="row" class="py-4 px-6 text-center font-medium colorclass whitespace-nowrap dark:text-white">
                    {index+1}
                </th>
                
                <td class="py-4 px-6 text-center text-white">
                  {report.reportDetails.username}
                </td>
                <td class="py-4 px-6 text-center text-red-500 ">
                  {report.report.condition}
                </td>  
            </tr>
        ))
      }
           
           
            
        </tbody>
    </table>

                      </div>










                           
                        </div>
                    </div>
                </div>
            </div>
}
    </div>
  )
}

export default Posts
