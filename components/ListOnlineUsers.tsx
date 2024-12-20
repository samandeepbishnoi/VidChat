"use client";

import { useSocket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect, useRef } from "react";
import Avatar from "./Avatar";

const ListOnlineUsers = () => {
  const { user } = useUser(); // Retrieve the authenticated user
  const { onlineUsers, handleCall } = useSocket();
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Track the selected user for the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedUser(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="relative flex flex-row gap-4 items-center justify-center border-b border-b-primary/10 w-full pb-2">
      {otherOnlineUsers && otherOnlineUsers.length > 0 ? (
        otherOnlineUsers.map((onlineUser) => (
          <div key={onlineUser.userId} className="relative">
            {/* User Avatar */}
            <div
              onClick={() =>
                setSelectedUser(
                  selectedUser === onlineUser.userId ? null : onlineUser.userId
                )
              }
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              <Avatar src={onlineUser.profile.imageUrl} />
              <div className="text-sm">
                {onlineUser.profile.fullName?.split(" ")[0]}
              </div>
            </div>

            {/* Dropdown */}
            {selectedUser === onlineUser.userId && (
              
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 bg-gradient-to-b from-slate-300 to-white rounded-lg shadow-lg p-5 z-60 w-56"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                {/* Pointer */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-gradient-to-b from-slate-100 to-slate-300 "></div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute text-bold top-2 right-2 text-rose-500 font-bold hover:text-gray-700"
                >
                  ✕
                </button>

                {/* Avatar */}
                <div className="flex justify-center mb-3">
                  <Avatar src={onlineUser.profile.imageUrl}  />
                </div>

                {/* User Full Name */}
                <div className="text-center text-gray-800 text-lg font-medium mb-3">
                  {onlineUser.profile.fullName}
                </div>

                {/* Call Button */}
                <button
                  onClick={() => handleCall(onlineUser)}
                  className="w-full px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                >
                  Make Call
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-sm">No users online</div>
      )}
    </div>
  );
};

export default ListOnlineUsers;
