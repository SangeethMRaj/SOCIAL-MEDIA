import React, { useState } from 'react'
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

function Adminlogin() {
    const [admin,setAdmin] = useState({
        username:'',
        password:''
    })
    const navigate= useNavigate()
    const [loginErr,setLoginErr] = useState(false)
    console.log(admin);
    const handleChange = (e) =>{
        const { name, value } = e.target
    setAdmin({
      ...admin,
      [name]: value

    })
    }
    const submit = (e) =>{
        const {username,password} = admin
        // if(username && password){
            console.log('inside if');
            axios.post("http://localhost:4000/admin/login",admin).then((response)=>{
                console.log('inside axios');
                console.log(response.data.msg);
                if(response.data.msg=="login"){
                    console.log('in login if');
                    navigate('/admin/users')
                }else{
                    console.log('nologin');
                    setLoginErr(true)
                    e.preventDefault()
                }
            })
        // }

    }
  return (
    <div>
      <section class="bg-black">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          {/* <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/> */}
          Admin Login    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div class="text-center">

              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
            </div>
            <div className='text-center'>
            <error className="text-red-600">{loginErr?"Invalid username or password":""}</error>
            </div>

                  <div>
                      <label  for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input type="text" name="username" id="email" onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required=""/>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" onChange={handleChange} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  <div class="flex items-center justify-between">
                      <div class="flex items-start">

                      </div>
                      
                  </div>
                  <button onClick={submit} type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default Adminlogin
