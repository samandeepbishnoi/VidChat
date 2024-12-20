"use client";
import { useSocket } from "@/context/SocketContext";
import React, { useEffect } from "react";
import Avatar from "./Avatar";
import { MdCall, MdCallEnd } from "react-icons/md";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangup } = useSocket();

  //cut on refresh or tab clode
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (ongoingCall?.isRinging) {
        handleHangup({
          ongoingCall,
          isEmitHangup: true,
        });
        event.preventDefault();
        event.returnValue = ""; // Optional: Show confirmation dialog (browser dependent).
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [ongoingCall, handleHangup]);

  if (!ongoingCall?.isRinging) return null;

  return (
    <div
      className="absolute inset-0 bg-slate-200 bg-opacity-70 flex items-center justify-center z-50"
      aria-labelledby="incoming-call-title"
    >
      <div className="bg-gradient-to-b from-white to-slate-300 min-w-[300px] sm:min-w-[350px] min-h-[150px] flex flex-col items-center justify-center rounded-lg p-4 shadow-lg pointer-events-auto">
        {/* Caller Information */}
        <div className="flex flex-col items-center">
          <Avatar
            src={ongoingCall.participants.caller.profile.imageUrl || ""}
          />
          <h2
            id="incoming-call-title"
            className="text-lg font-semibold mt-2 text-gray-700"
          >
            {ongoingCall.participants.caller.profile.fullName?.split(" ")[0] ||
              "Unknown Caller"}
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">Incoming Call</p>

        {/* Action Buttons */}
        <div className="flex flex-row space-x-16 mt-5">
          <button
            onClick={() => handleJoinCall(ongoingCall)}
            aria-label="Answer Call"
            className="w-14 h-14   flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 shadow-lg text-white transition-all duration-200"
          >
            <MdCall size={24} />
          </button>
          <button
            onClick={() =>
              handleHangup({
                ongoingCall: ongoingCall ? ongoingCall : undefined,
                isEmitHangup: true,
              })
            }
            aria-label="Decline Call"
            className="w-14 h-14 flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg text-white transition-all duration-200"
          >
            <MdCallEnd size={24} />
          </button>
        </div>
      </div>
      {/* Block interactions with the background */}
      {/* <div className="absolute inset-0 pointer-events-none" /> */}
    </div>
  );
};

export default CallNotification;
