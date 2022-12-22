import React,{useState} from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ForgotPasswordOtp() {
    const {register,formState:{errors},handleSubmit} = useForm()
    const [error,setError] = useState(false)
    const navigate = useNavigate()
    const [incorrectOtp,setIncorrectOtp] = useState(false)
    const [otpCheck,setOtp] = useState({
      otp:'',
      password:''
    })

    const handleChange = (e)=>{
        console.log('llll');
        const {name,value} = e.target
        setOtp({
            ...otpCheck,
            [name]:value
        })
    }

    const submit = () =>{
      const {otp,password} =otpCheck
      axios.post("http://localhost:4000/otp",otpCheck).then((response)=>{
        if(response.data.msg==="incorrect otp"){
          setIncorrectOtp(true)
        }
        if(response.data.msg==="otp verified"){
          navigate('/')
        }
      }).catch((err)=>{
        navigate('/error')
      })
    }
  return (
    <div>
      <section class="bg-black ">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          {/* <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/> */}
          Change Password    
      </a>
      <div class="w-full mt-4 space-y-4 lg:mt-5 md:space-y-5 p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              
          </h2>
          <form onSubmit={handleSubmit(submit)}>
              <div>
                {error && <h1 className='mx-28 mb-4 text-red-600'>Invalid Email Address</h1>}
                  <label for="text" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Otp</label>
                  <input type="password" name="otp"  id="otp" {...register("otp",{required:'Otp is required'})} onChange={handleChange} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="XXXX" required=""/>
                  {errors.email&&(<small className='text-red-500'>{errors.email.message}</small>)}
              </div>
              
              <div>
                  <label for="confirm-password" class="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                  <input type="password" name="password"  id="confirm-password" {...register("password",{minLength:3,required:true})} onChange={handleChange} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  <error className="text-red-600">
                                {errors.password?.type === "minLength" && "Password must be atleast 3 digit"}
                                {errors.password?.type === "required" && "Password is required"}
                  </error>
              </div>
              {/* <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="newsletter" aria-describedby="newsletter" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="newsletter" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                  </div>
              </div> */}
              <button type="submit"  class="w-full text-white bg-blue-600 mt-2 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Reset password</button>
              </form>
      </div>
  </div>
</section>
    </div>
  )
}

export default ForgotPasswordOtp
