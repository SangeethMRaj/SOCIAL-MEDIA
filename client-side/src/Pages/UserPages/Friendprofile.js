import React from 'react'
import FriendPosts from '../../Components/UserProfileTabs/FriendPosts'
import FriendProfile from '../../Components/UserProfileTabs/FriendProfile'
import UserPosts from '../../Components/UserProfileTabs/UserPosts'

function Friendprofile() {
  return (
    <div className='bg-gray-300 min-h-screen'>
      <FriendProfile/>
      <FriendPosts/>
    </div>
  )
}

export default Friendprofile
