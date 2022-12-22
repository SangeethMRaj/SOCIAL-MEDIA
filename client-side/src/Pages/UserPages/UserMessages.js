import React from 'react'
import UserChat from '../../Components/User/UserChat'

function UserMessages({socketio}) {
  return (
    <div>
      <UserChat socket={socketio}/>
    </div>
  )
}

export default UserMessages
