import React from "react";

import { useAppContext } from "../GlobalContext";

import Image from "next/image";
import { image } from "html2canvas-pro/dist/types/css/types/image";

const ImageModal = () => {
  const {
    imageListForModal,
    setImageListForModal,
    router,
    imageModalId,
    setImageModalId,
  } = useAppContext();

  const imageModalRef = React.useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    // router.replace(window.location.pathname, undefined);
    setImageListForModal([]);
    setImageModalId("");
  };

  const handleDelete = (index: number) => {
    const filtered = imageListForModal.filter((_, i) => i !== index);
    setImageListForModal(filtered);
  };

  React.useEffect(() => {
    if (imageListForModal.length) {
      router.push("#item0");
    }
  }, [imageListForModal]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    imageModalRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      imageModalRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // console.log(imageListForModal)

  return (
    <dialog
      id="imageModal"
      className="modal backdrop-blur-lg"
      ref={imageModalRef}
    >
      <div className=" h-[100vh] w-[100vw] md:h-[90vh] md:w-[90vw] relative">
        <form className="absolute right-2 top-2 z-50 " method="dialog">
          <button onClick={handleClose} className="close-button"></button>
        </form>

        <div className="carousel w-full h-full p-2 ">
          {imageListForModal.map((image, index) => (
            <div
              className="carousel-item relative p-2 w-full items-center justify-center"
              key={`item${index}`}
              id={`item${index}`}
            >
              <img className="max-w-full grow" src={image} alt="" />
              {imageListForModal.length > 1 && (
                <>
                  {/*  */}
                  <a
                    className={`${
                      imageListForModal.length == index + 1 && " hidden"
                    } top-[48%] right-2 absolute text-xl z-50 btn btn-sm btn-circle`}
                    key={`item${index + 1}`}
                    href={`#item${index + 1}`}
                  >
                    {`>`}
                  </a>
                  {/*  */}
                  <a
                    className={`${
                      index == 0 && " hidden"
                    } top-[48%] left-2 absolute text-xl z-50 btn btn-sm btn-circle`}
                    key={`item${index - 1}`}
                    href={`#item${index - 1}`}
                  >
                    {`<`}
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </dialog>
  );
};

export default ImageModal;
