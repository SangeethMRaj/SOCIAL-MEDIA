import axios from '../Instance/AxiosInstance'
import React,{useEffect,useState} from 'react'
import {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { User, UserContext } from '../../Pages/Context/Context'
import {IoMdPhotos} from 'react-icons/io'
import LoginPage from '../../Pages/Login'
import Swal from 'sweetalert2'

function EditProfile() {
    const {user,setUser} = useContext(UserContext)
    const [profileDetails,setProfileDetails] = useState([])
    const [modal,setModal] = useState(false)
    const [image,setImage] = useState('')
    const [userDetails,setUserDetails] = useState({
        username:'',
        email:'',
        phone:'',
        career:'',
        bio:''
    })
    const [form, setform] = useState({
      Images: ''
  })
    const navigate = useNavigate()
    console.log(userDetails,'userDetails');
    const handleChange = (e) =>{
        const { name, value } = e.target
        setUserDetails({
            ...userDetails,
            [name]: value
        })
    }

    useEffect(()=>{
      try{
        const userId = user.id
        axios.get("/viewprofiledetails/"+userId,{
          headers: {
              "x-access-token": localStorage.getItem("token"),
          },
      }).then((response)=>{
            console.log(response.data[0].username,'yesyesyesyes');
            setProfileDetails(response.data)
            setUserDetails({
                username:response.data[0].username,
                email:response.data[0].email,
                phone:response.data[0].phone,
                career:response.data[0].career,
                bio:response.data[0].bio
            })
        })

      }catch(err){
        navigate('/error')
      }
    },[])

    const fileUpload = (e) =>{
      const image = e.target.files[0]
      setform({
          ...form,
          Images: image
      })
      setImage(URL.createObjectURL(e.target.files[0]))
    }
    console.log(form);

    const addProfilePic = () =>{
      try{
        const Data = new FormData();
        for (let key in form) {
            Data.append(key, form[key])
        }
        Data.append('user',user.id)
        const {  Images } = form
          if (Images) {
              axios.post("/addprofilepic", Data,{
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                },
            })
                navigate('/user/home')
             
          }

      }catch(err){
       navigate('/error')
      }
    }

    const submit = () =>{
        Swal.fire({
            title: "Edit Profile",
            text: "Are you sure you want to make the changes?",
            icon: "success",
            confirmButtonText: "OK",
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
              try{
                const userId = user.id
                console.log(userDetails,'userDetails in submit function');
                axios.post("/editprofile/"+userId,userDetails,{
                  headers: {
                      "x-access-token": localStorage.getItem("token"),
                  },
              })
                navigate('/user/profile/posts')

              }catch(err){
                navigate('/error')
              }
            }
        })
    }
    
  return (
    <div>

<div class="h-full">
 
    {
        profileDetails.map((item,index)=>(
  <div class="block md:flex sm:pt-4">

    <div class="w-full md:w-2/5 p-4 text-center  bg-white shadow-2xl hover:shadow-gray-700">
      <div class="flex justify-between ">
        <span class="text-2xl font-semibold block text-center ml-48">{profileDetails[0].username}</span>
        {/* <a href="#" class="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800">Edit</a> */}
      </div>

      <div class="w-full p-8 mx-2 flex justify-center">
        {profileDetails[0].Images?<img id="showImage" class="max-w-xs w-56 h-56 items-center border rounded-full" src={`${axios.images}/${profileDetails[0].Images}`} alt=""/>
        : <img id="showImage" class="max-w-xs w-56 h-56 items-center border rounded-full" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA0BrKaI0cwXl3-wpk6Fu2gMbrP1LKk6waAlhKhrTzTobcVlka34MsNf4Yp3k1tG4ufTY&usqp=CAU' alt=""/>
        }                         
        </div>
        
        <button className='bg-blue-700 p-2 rounded-xl content-center text-white md:mx-auto' onClick={()=>setModal(true)}>Change Profile Picture</button>
    </div>

        
    <div class="w-full md:w-3/5 bg-white lg:ml-4 shadow-2xl hover:shadow-gray-700">
      <div className='w-full justify-end flex p-1'>
      <button className='text-black  ml-auto mr-2' onClick={()=>navigate('/user/profile/posts')}>X</button>

      </div>
      <div class="rounded  shadow p-6 m-5">
        <div class="pb-6">
          <label for="name" class="font-semibold text-gray-700 block pb-1">Username</label>
          <div>
            <input id="username" name='username' class="border-1 rounded-md px-4 py-2 w-full outline outline-gray-300 text-slate-400" type="text" defaultValue={profileDetails[0].username} onChange={handleChange} />
          </div>
        </div>

        <div class="pb-4">
          <label for="about" class="font-semibold text-gray-700 block pb-1">Email</label>
          <input id="email" name='email' class="border-1 rounded-md px-4 py-2 w-full outline outline-gray-300 text-slate-400" type="email" defaultValue={profileDetails[0].email} onChange={handleChange} />
        </div>
        
        <div class="pb-4">
          <label for="about" class="font-semibold text-gray-700 block pb-1">Phone</label>
          <input id="email" name='phone' class="border-1  rounded-md px-4 py-2 w-full outline outline-gray-300 text-slate-400" type="phone" defaultValue={profileDetails[0].phone} onChange={handleChange} />
        </div>

        <div class="pb-4">
          <label for="about" class="font-semibold text-gray-700 block pb-1">Career</label>
          <input id="email" name='career' class="border-1 rounded-md px-4 py-2 w-full outline outline-gray-300 text-slate-400" type="text" defaultValue={profileDetails[0].career} onChange={handleChange}/>
        </div>
        <div class="pb-4">
          <label for="about" class="font-semibold text-gray-700 block pb-1">Bio</label>
          <input id="email" name='bio' class="border-1  rounded-md px-4 py-2 w-full outline outline-gray-300 text-slate-400" type="text" defaultValue={profileDetails[0].bio} onChange={handleChange}/>
        </div>

        <button className='bg-blue-700 p-2 rounded-xl content-center text-white md:mx-auto ' onClick={submit}>Update Profile</button>
      

        
      </div>
    </div>

  </div>
 
    ))}
</div>





{modal && <div id="popup-modal" tabindex="-1" class="overflow-y-auto fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal  md:h-full justify-center items-center" aria-hidden="true">
                    <div class="relative mx-auto mt-52 w-full max-w-md h-full md:h-auto">
                        <div class="relative bg-white border-2 border-black  m-2 rounded-lg shadow-md ">
                            <button onClick={()=>setModal(false)} type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="popup-modal">
                                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                            <div class="p-6 text-center w-full mt-4">
                              <div className=''>

                                {image ? <img src={image} alt="" className='ml-20'/> :
                                    <h1 class=" text-3xl font-normal underline text-gray-500 dark:text-gray-400  w-full m-3"><IoMdPhotos className='w-full h-36' /></h1>
                                } 
                              </div>

                                <div className='px-auto flex flex-col mt-4'>

                                    
                                    <label htmlFor="fileUpload" class="w-3/4 mx-auto text-center text-white bg-blue-600 cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm  px-5 py-2 mt-2">Upload Image</label>
                                    <input
                                        id="fileUpload" name="Images" type="file" placeholder="Company Name" onChange={fileUpload} autocomplete="email" required class="hidden w-5/6 h-10 bg-white relative rounded-xl block w-full appearance-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
                                </div>
                                <button onClick={addProfilePic} data-modal-toggle="popup-modal" type="button" class="text-white bg-blue-600 cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-2">
                                    Change Profile Picture
                                </button>

                            </div>
                        </div>
                    </div>
                </div>}
    </div>
  )
}

export default EditProfile
