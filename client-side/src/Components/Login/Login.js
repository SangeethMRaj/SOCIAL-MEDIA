import React, { useState,createContext, useContext,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from '../Instance/AxiosInstance'

function Login() {
    const navigate = useNavigate()
    const [userExist,setUserExist] = useState(false)
    const [blockedUser,setBlockedUser] = useState(false)
    const [user,setUser] = useState({
        email:"",
        password:""
    })
    const UserContext = createContext()
    console.log(user);
    
    const handleChange = (e) =>{
        const {name,value} = e.target
        setUser({
            ...user,
            [name]:value
        })
    }

    const authCheck = ()=>{
      axios.get("/isUserAuth",{
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }).then((response)=>{
          console.log(response,'response jwt');
          if(response.data.auth){
              navigate('/user/home')
          }
        }).catch((err)=>{
          console.log(err,'isuserauth');
          navigate('/error')
        })
  }
  useEffect(()=>{
      authCheck()
  },[])

    const submit = (e) =>{
      console.log('yes');
        const{email,password} = user 
        // if(email,password){
          try{
            axios.post("/login",user).then((response)=>{
                console.log(response.data,'response in login');
                if(response.data.auth){
                  console.log('user',response.data.user);
                  localStorage.setItem("token", response.data.token)
                  navigate('/user/home')
                }else{
                  if(response.data.message=="Wrong username password"){
                    setUserExist(true)
                  }
                  if(response.data.message=="The user is blocked"){
                    setBlockedUser(true)
                  }
                  if(response.data.message=="no user exists"){
                    setUserExist(true)
                  }
                }

            })

          }catch(err){
            console.log(err,'submit');
            navigate('/error')
          }
        // }
    }

  return (
    <div>
      <section class="h-screen bg-black" >
  <div class="px-6 h-full  text-gray-800">
    <div
      class="flex xl:justify-center border-orange-600 lg:justify-between justify-center items-center flex-wrap h-full g-6"
    >
      <div
        class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1554177255-61502b352de3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
          class="w-full h-1/5"
          alt="Sample image"
        />
      </div>
      <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
        <form>
          <div class="flex flex-row items-center  justify-center lg:justify-start">
            <p class="text-3xl text-white ml-32 mb-6 mr-4">Sign in to your account</p>
            
            {/* <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-4 h-4">
                <path
                  fill="currentColor"
                  d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                />
              </svg>
            </button>

            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4">
                <path
                  fill="currentColor"
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                />
              </svg>
            </button>

            <button
              type="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              class="inline-block p-3 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-4 h-4">
                <path
                  fill="currentColor"
                  d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                />
              </svg>
            </button> */}
          </div>

          {/* <div
            class="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"
          >
            <p class="text-center font-semibold mx-4 mb-0">Or</p>
          </div> */}
          <div className='text-center pb-6'>
          <error class="text-red-600 text-center">
            {userExist?"Invalid email or password":""}
            {blockedUser?"The user is blocked":""}
          </error>
          </div>
         
          <div class="mb-6">
            <input
              type="text"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              name="email"
              onChange={handleChange}
              placeholder="Email address"
            />
          </div>

          <div class="mb-6">
            <input
              type="password"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="exampleFormControlInput2"
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <div class="flex justify-between items-center mb-6">
            <div class="form-group form-check">
             
             
            </div>
            <a onClick={()=>navigate('/forgotpassword')} class="text-white hover:underline cursor-pointer">Forgot password?</a>
          </div>

          <div class="text-center lg:text-left">
            <button
              type="button"
              onClick={submit}
              class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Login
            </button>
            <p class="text-sm font-semibold text-white mt-2 pt-1 mb-0">
              Don't have an account?
              <a
                class="text-blue-600 hover:text-red-700  transition duration-200 ease-in-out cursor-pointer hover:underline" onClick={()=>navigate('/signup')}
                >Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Login
