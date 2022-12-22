import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const {register,formState:{errors},handleSubmit} = useForm()
    const [user,setUser] = useState({
        username:'',
        email:'',
        phone:'',
        password:''
    })
    const [userExist,setUserExist] = useState(false)

    const handleChange = (e)=>{
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    // const authCheck = ()=>{
    //     axios.get("http://localhost:4000/isUserAuth",{
    //         headers: {
    //           "x-access-token": localStorage.getItem("token"),
    //         },
    //       }).then((response)=>{
    //         console.log(response,'response jwt');
    //         if(!response.data.auth){
    //             navigate('/user/home')
    //         }
    //       })
    // }
    // useEffect(()=>{
    //     authCheck()
    // },[])
    const submit = (data,e) =>{
        console.log('lllllll');
        try{

            const {username,email,phone,password} = user
            if(username && email && phone && password){
                axios.post("http://localhost:4000/signup",user).then((response)=>{
                    console.log(response.data.msg);
                    if(response.data.msg=="User exist"){
                        setUserExist(!userExist)
                        console.log(response.data.msg);
                        console.log('user');
                        navigate('/signup')
                    }if(response.data.msg=="No user exist"){
                        console.log("no user");
                        console.log(response.data.msg);
                        navigate('/')
                    }
                })
            }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div>
        <div className="bg-grey-lighter bg-black min-h-screen flex flex-col">
            
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    
                    <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                        <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                        <error className="pl-28 text-red-600">
                            {userExist?"Email Id exists":""}
                        </error>
                     
                        <form onSubmit={handleSubmit(submit)}>
                        <input
                            type="text"
                            className="block border border-grey-light w-full p-3 rounded mb-4"
                            name="username"
                            placeholder="Full Name"
                            {...register("username",{required:'Username is required'})}
                            onChange={handleChange}
                             />
                             <error className="text-red-600">
                            {errors.username&&(<small className='text-red-500'>{errors.username.message}</small>)}
                            </error>

                        <input
                            type="email"
                            className="block border border-grey-light w-full p-3 rounded mb-4"
                            name="email"
                            placeholder="Email"
                            {...register("email",{required:'Email is required'})}
                            onChange={handleChange}
                            />
                             <error className="text-red-600">
                            {errors.email&&(<small className='text-red-500'>{errors.email.message}</small>)}
                            </error>

                        <input
                            type="number"
                            className="block border border-grey-light w-full p-3 rounded mb-4"
                            name="phone"
                            placeholder="phone" 
                            {...register("phone",{minLength:10,maxLength:10,required:'Phone No: must be 10 digit'})}
                            onChange={handleChange}
                             />
                             <error className="text-red-600">
                                {errors.phone?.type === "minLength" && "Phone No: must be 10 digit"}
                                {errors.phone?.type === "maxLength" && "Phone No: must be 10 digit"}
                                {errors.phone?.type === "required" && "Phone No: is required"}
                            </error>

                        <input
                            type="password"
                            className="block border border-grey-light w-full p-3 rounded mb-4"
                            name="password"
                            placeholder="Password"
                            {...register("password",{minLength:3,required:true})}
                            onChange={handleChange}
                            />
                            <error className="text-red-600">
                                {errors.password?.type === "minLength" && "Password must be atleast 3 digit"}
                                {errors.password?.type === "required" && "Password is required"}
                            </error>
                        {/* <input
                            type="password"
                            className="block border border-grey-light w-full p-3 rounded mb-4"
                            name="confirmpassword"
                            placeholder="Password"
                            onChange={handleChange}
                            />     */}

                        <button 
                            type="submit"
                            className="w-full text-center py-3 bg-blue-500  rounded text-white hover:bg-green-dark focus:outline-none my-1"
                        >Create Account</button>
                       </form>

                        <div className="text-center text-sm text-grey-dark mt-4">
                            By signing up, you agree to the 
                            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                                Terms of Service
                            </a> and
                            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                                Privacy Policy
                            </a>
                        </div>
                    </div>

                    <div className="text-white mt-6">
                        Already have an account?
                        <a className="no-underline  border-blue text-blue cursor-pointer hover:underline" onClick={()=>navigate('/')} >
                            Log in
                        </a>.
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Signup
