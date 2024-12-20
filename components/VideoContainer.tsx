import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface iVideoContainer {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}

const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: iVideoContainer) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video
        className={cn(
          "rounded border-white border-[1px] w-[800px] ",
          isLocalStream &&
            isOnCall &&
            "w-[200px] h-auto absolute border-white border-[1px] shadow-sm"
        )}
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocalStream}
      />
    </div>
  );
};

export default VideoContainer;
