'use client'

import { useSocket } from '@/context/SocketContext'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import Avatar from './Avatar'

const ListOnlineUsers = () => {
  const { user } = useUser()
  const { onlineUsers } = useSocket()

  // Filter out the current user from the online users list
  const otherOnlineUsers = onlineUsers?.filter(onlineUser => onlineUser.profile.id !== user?.id)

  return (
    <div className='flex flex-col gap-4 items-center justify-center border-b border-b-primary/10 w-full pb-2'>
      {otherOnlineUsers && otherOnlineUsers.length > 0 ? (
        otherOnlineUsers.map(onlineUser => (
          <div key={onlineUser.userId} className='flex flex-col items-center gap-1 cursor-pointer'>
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className='text-sm'>{onlineUser.profile.fullName?.split(' ')[0]}</div>
          </div>
        ))
      ) : (
        <div className='text-gray-500 text-sm'>No users online</div>
      )}
    </div>
  )
}

export default ListOnlineUsers
