// import { useEffect,useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
// import axios from 'axios'

// const PrivateRoutes = () => {
//     const [tokenlogin,setToken] = useState()
//     useEffect(()=>{
//         const token = localStorage.getItem("token");
//         console.log('token',token);
//         setToken(token)
//     })
//     console.log('tokenlogin',tokenlogin);
//     console.log('tokenlogin',tokenlogin);
// return (
//     token ? <Outlet/> : <Navigate to='/'/>
//   )
// }

const PrivateRoutes = () => {
    let auth = {'token':true}
  return (
      auth.token ? <Outlet/> : <Navigate to='/'/>
    )
  }


 export default PrivateRoutes;