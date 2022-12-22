import React,{useState} from 'react'
import { NavLink } from 'react-router-dom'
import {
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaShoppingBag
} from 'react-icons/fa'
import '../../Components/sideBar/SideBar.css'
// import '../../Component/Header/header.css'

function SideBar({children}) {
    const [isOpen,setIsOpen] = useState(true)
    const toggle = ()=>setIsOpen(!isOpen);

    const menuItem=[
        // {
        //     path:'/admin/dashboard',
        //     name:'Dashboard',
        //     icon:<FaTh/>
        // },
        // {
        //     path:'/admin/dashboard',
        //     name:'Dashboard',
        //     icon:<FaShoppingBag/>
        // },
        {
            path:'/admin/users',
            name:'User',
            icon:<FaUserAlt/>
        },
        {
            path:'/admin/posts',
            name:'Posts',
            icon:<FaRegChartBar/>
        }
        
    ]
  return (
    <div className='container '>
      <div style={{width:isOpen ? "200px" :"50px"}} className="sidebar">
        <div className="top_section">
            <div className='flex items-center mb-3'>

            <h1 style={{display:isOpen ? "block" :"none"}} className="logo">Admin</h1>
            <div style={{marginLeft:isOpen ? "50px" :"-5px"}} className="bars">
                <FaBars onClick={toggle}/>
            </div>
            </div>
        </div>
        {
            menuItem.map((item,index)=>(
                <NavLink to={item.path} key={index} className="link" activeclassName="active">
                    <div className="icon">{item.icon}</div>
                    <div style={{display:isOpen ? "block" :"none"}} className="link_text">{item.name}</div>
                </NavLink>
            ))
        }
      </div>
      {/* <main>{children}</main> */}
    </div>
  )
}

export default SideBar