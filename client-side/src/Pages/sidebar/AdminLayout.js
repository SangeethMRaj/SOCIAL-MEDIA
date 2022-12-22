import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../Components/sideBar/SideBar'
import AdminHeader from '../../Components/Header/AdminHeader'

function AdminLayout() {
  return (
    <div class="flex">
      <div>
        <SideBar/>
        </div>
        <div className='w-full'>
            <AdminHeader/>
            <div className='p-2'>
            <Outlet/>
            </div>
       
        </div>
    </div>
  )
}

export default AdminLayout
