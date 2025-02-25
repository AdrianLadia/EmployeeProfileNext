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

  return (
    <dialog
      id="videoModal"
      className="modal !w-[100vw] backdrop-blur-sm"
      ref={videoModalRef}
    >
      <div className="bg-transparent shadow-none flex flex-col justify-center items-center relative ">

        <form className="absolute top-2 right-2 z-10" method="dialog">
          <button onClick={handleClose} className="close-button"></button>
        </form>

        {videoForModal ? (
          <video className=" max-h-[90vh] max-w-[98vw] min-w-[80vw] md:min-w-[50vw] " controls>
            <source src={videoForModal || ""} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-white">No video available</div>
        )}
      </div>
    </dialog>
  );
};

export default VideoModal;
