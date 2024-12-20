"use client";
import { useSocket } from "@/context/SocketContext";
import React, { useCallback, useEffect, useState } from "react";
import VideoContainer from "./VideoContainer";
import { MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCallEnd } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const VideoCall = () => {
  const { localStream, peer, isCallEnded, ongoingCall, handleHangup } = useSocket();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVidOn, setIsVidOn] = useState(true);

  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      setIsVidOn(videoTrack.enabled);
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;


  // Handle tab close or refresh
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isOnCall) {
        handleHangup({
          ongoingCall: ongoingCall ? ongoingCall : undefined,
          isEmitHangup: true,
        });
        event.preventDefault();
        event.returnValue = ""; // Display a confirmation dialog (optional, behavior depends on the browser)
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isOnCall, ongoingCall, handleHangup]);



  if (isCallEnded) {
    return <div className="mt-5 text-rose-500 text-center text-lg font-semibold">Call Ended</div>;
  }

  if (!localStream && !peer) return null;

  return (
    <div
      className="absolute inset-0 bg-slate-200 bg-opacity-70 flex flex-col items-center justify-center z-50"
      aria-labelledby="incoming-call-title"
    >
    {/* <div className="flex flex-col items-center justify-center bg-slate-100"> */}
      <div className="m-4">
        {localStream && (
          <VideoContainer
            stream={localStream}
            isLocalStream={true}
            isOnCall={isOnCall}
          />
        )}
        {peer && peer.stream && (
          <VideoContainer
            stream={peer.stream}
            isLocalStream={false}
            isOnCall={isOnCall}
          />
        )}
      </div>

      <div className="mt-7 flex items-center justify-center space-x-6">
        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 shadow-lg transition-all duration-200 ${
            isMicOn ? "text-green-500" : "text-red-500"
          }`}
          onClick={toggleMic}
          data-tooltip-id="mic-control"
        >
          {isMicOn ? <MdMic size={28} /> : <MdMicOff size={28} />}
        </button>
        <Tooltip id="mic-control" content={isMicOn ? "Turn off Mic" : "Turn on Mic"} />

        <button
          className="w-14 h-14 flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 shadow-lg text-white transition-all duration-200"
          onClick={() =>
            handleHangup({
              ongoingCall: ongoingCall ? ongoingCall : undefined,
              isEmitHangup: true,
            })
          }
          data-tooltip-id="end-call"
        >
          <MdCallEnd size={28} />
        </button>
        <Tooltip id="end-call" content="End Call" />

        <button
          className={`w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 shadow-lg transition-all duration-200 ${
            isVidOn ? "text-green-500" : "text-red-500"
          }`}
          onClick={toggleCamera}
          data-tooltip-id="camera-control"
        >
          {isVidOn ? <MdVideocam size={28} /> : <MdVideocamOff size={28} />}
        </button>
        <Tooltip id="camera-control" content={isVidOn ? "Turn off Camera" : "Turn on Camera"} />
      </div>
      
    </div>
    
  );
};

export default VideoCall;
