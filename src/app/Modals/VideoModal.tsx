import React from "react";

import { useAppContext } from "../GlobalContext";

const VideoModal = () => {
  const { videoForModal, setVideoForModal } = useAppContext();

  const videoModalRef = React.useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    setVideoForModal(""); 
  }; 

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    videoModalRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      videoModalRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

//   console.log(videoForModal);

  return (
    videoForModal && (
      <dialog id="videoModal" className="modal !w-[100vw] backdrop-blur-sm" ref={videoModalRef}>
        <div className="bg-transparent shadow-none flex flex-col !w-full h-max justify-center items-center relative py-14 px-10">
          {/* <video className="h-full w-full" src={videoForModal}></video> */}

          <form className="absolute top-2 right-10" method="dialog">
            <button onClick={handleClose} className="close-button"></button>
          </form>

          <video
            className="w-[100vw] bg-red-500"
            width="100vw"
            height="240"
            controls
          >
            <source src={videoForModal || ""} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </dialog>
    )
  );
};

export default VideoModal;
