import React from 'react'
import { Outlet } from 'react-router-dom'
import UserBio from '../../Components/UserProfileTabs/UserBio'
import UserPosts from '../../Components/UserProfileTabs/UserPosts'

function UserProfile() {
  return (
    <div className='bg-gray-300 min-h-screen'>
        <UserBio/>
        <UserPosts/>
    </div>
  )
}

export default UserProfile
