'use client'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import Avatar from './Avatar'
import { MdCall, MdCallEnd } from 'react-icons/md'

const CallNotification = () => {
    const { user } = useUser() // Get current user's details
    const { ongoingCall } = useSocket() // Get ongoing call details

    if (!ongoingCall) return null; // If there's no ongoing call, don't render anything

    const isCaller = ongoingCall.participants.caller.profile.id === user?.id; // Check if the current user is the caller
    const isRecipient = ongoingCall.participants.reciever.profile.id === user?.id; // Check if the current user is the recipient

    if (!isCaller && !isRecipient) return null; // If the current user is neither the caller nor recipient, don't render the UI

  return (
    <div className='absolute bg-slate-500 bg-opacity-70 w-screen h-screen top-0 left-0 flex items-center justify-center'>
      <div className='bg-white min-w-[300px] min-h-[100px] flex flex-col items-center justify-center rounded p-4'>
        <div className='flex flex-col items-center'>
            <Avatar src={isCaller ? ongoingCall.participants.caller.profile.imageUrl : ongoingCall.participants.reciever.profile.imageUrl} />
            <h3>{isCaller ? ongoingCall.participants.caller.profile.fullName?.split(' ')[0] : ongoingCall.participants.reciever.profile.fullName?.split(' ')[0]}</h3>
        </div>
        <p className='text-sm mb-2'>{isCaller ? "Calling..." : "Incoming Call"}</p>
        <div className='flex flex-row gap-8 top-2 bottom-2'>
            {/* If it's the caller, show the hang-up button */}
            {isCaller && (
                <button className='w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white'>
                    <MdCallEnd size={24} />
                </button>
            )}

            {/* If it's the recipient, show answer and decline buttons */}
            {isRecipient && (
                <>
                    <button className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white'>
                        <MdCall size={24} />
                    </button>
                    <button className='w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white'>
                        <MdCallEnd size={24} />
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  )
}

export default CallNotification
