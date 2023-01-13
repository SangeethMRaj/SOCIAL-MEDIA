import axios from '../../Components/Instance/AxiosInstance'
import React,{useEffect,useReducer} from 'react'
import { useState } from 'react'
import '../../Components/Header/AdminHeader.css'
import Swal from 'sweetalert2'

function UserList() {
    const [status,setStatus] = useReducer(x=>x+1,0)
    const [user,setUser] = useState([])
    console.log('user');
    console.log(user);
    useEffect(()=>{
        async function viewUser(){
            const userData = await axios.get("/admin/users")
            if(userData){
                setUser(userData.data)
            }
        }
        viewUser()

    },[status])

    const block = (e,id)=>{
        Swal.fire({
            title: "Block",
            text: "Are you sure you want to block the user?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton:true
          }).then((result)=>{
            if(result.isConfirmed){
                console.log(id);
                axios.post("/admin/block/"+id)
                setStatus(!status)
            }
          })
        
    }

    const Unblock = (e,id)=>{
        Swal.fire({
            title: "Unblock",
            text: "Are you sure you want to unblock the user?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton:true
          }).then((result)=>{
            if(result.isConfirmed){
        axios.post("/admin/unblock/"+id)
        setStatus(!status)
    }
})
    }

    const Approve = (e,id)=>{
       
        Swal.fire({
            title: "Verify",
            text: "Are you sure you want to verify the user?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton:true
          }).then((result)=>{
            if(result.isConfirmed){
        axios.post("/admin/verify/"+id)
        setStatus(!status)
    }
})
    }
  return (
    <div>
      <div class="overflow-x-auto relative rounded-md">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 scroll-table">
        <thead class="text-xs text-gray-700 uppercase colorclass dark:bg-gray-700 dark:text-gray-400">
            <tr>
            <th scope="col" class="py-3 px-6">
                    Sl.No
                </th>
                <th scope="col" class="py-3 px-6">
                    Name
                </th>
                <th scope="col" class="py-3 px-6">
                    Email
                </th>
                <th scope="col" class="py-3 px-6">
                    Phone
                </th>
                <th scope="col" class="py-3 px-6">
                    Action
                </th>
                <th scope="col" class="py-3 px-6">
                    Verification
                </th>
                {/* <th scope="col" class="py-3 px-6">
                    Block
                </th> */}
            </tr>
        </thead>
        <tbody>
            {
               user.map((users,index)=>(
                <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 colorclass item-center">
            <th scope="row" class="py-4 px-6 font-medium colorclass whitespace-nowrap dark:text-white">
                    {index+1}
                </th>
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                   {users.username}
                </th>
                <td class="py-4 px-6">
                    {users.email}
                </td>
                <td class="py-4 px-6">
                  {users.phone}
                </td>
                
                {users.userStatus ?
                <td  class="py-4 px-6">
                <button onClick={(e)=>{
                    block(e,users._id)
                }} className='bg-red-600 approve'>block</button>
            </td>
                 :
                 <td  class="py-4 px-6">
                    <button onClick={(e)=>{
                        Unblock(e,users._id)
                    }} className='bg-green-600 approve'>Unblock</button>
                </td>}

               {users.applyVerification && users.verification===false ? <td  class="py-4 px-6">
                    <button onClick={(e)=>{
                        Approve(e,users._id)
                    }} className='bg-green-600 approve'>Approve</button>
                </td>  
                : users.verification ? <h1 className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white'>Approved</h1> :
                <td  class="py-4 px-6">
                    
                </td>}
                
                {/* <td  class="py-4 px-6">
                    <button onClick={(e)=>{
                        block(e,users._id)
                    }} className='bg-red-600 approve'>block</button>
                </td> */}

               
            </tr>
               ))

                
            
                
        }
            
        </tbody>
    </table>
</div>
    </div>
  )
}

export default UserList
