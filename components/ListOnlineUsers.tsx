"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import React from "react";
import Avatar from "./Avatar";

const ListOnlineUsers = () => {
  const { user } = useUser(); // Retrieve the authenticated user
  const { onlineUsers, handleCall } = useSocket();

  // If there is no user (not signed in), return a message with center alignment and border
  if (!user) {
    return (
      <div className="flex justify-center items-center w-full pb-2 border-b border-b-primary/10">
        <div className="text-center text-gray-500 text-sm">
          Please sign in to see online users
        </div>
      </div>
    );
  }

  // Filter out the current user from the online users list
  const otherOnlineUsers = onlineUsers?.filter(
    (onlineUser) => onlineUser.profile.id !== user?.id
  );

  return (
    <div className="flex flex-row gap-4 items-center justify-center border-b border-b-primary/10 w-full pb-2">
      {otherOnlineUsers && otherOnlineUsers.length > 0 ? (
        otherOnlineUsers.map((onlineUser) => (
          <div
            key={onlineUser.userId}
            onClick={() => handleCall(onlineUser)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <Avatar src={onlineUser.profile.imageUrl} />
            <div className="text-sm">
              {onlineUser.profile.fullName?.split(" ")[0]}
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-sm">No users online</div>
      )}
    </div>
  );
};

export default ListOnlineUsers;
