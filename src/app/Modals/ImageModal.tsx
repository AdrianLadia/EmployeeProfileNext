import React from "react";

import { useAppContext } from "../GlobalContext";

import Image from "next/image"; 

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

  return (
    <dialog
      id="imageModal"
      className="modal backdrop-blur-md !p-0 "
      ref={imageModalRef}
    >
      <form className="absolute right-4 top-2 z-50 " method="dialog">
        <button onClick={handleClose} className="close-button"></button>
      </form>
      <div className=" h-[90vh] w-[90vw] relative pt-4">
        <div className="carousel w-full h-full gap-1">
          {imageListForModal.map((image, index) => (
            <div
              className="carousel-item relative w-full items-center md:items-start justify-center group "
              key={`item${index}`}
              id={`item${index}`}
            >
              {/*  */}
              <div
                className={`${!imageModalId && " hidden "}
                absolute top-1/2 bottom-1/2 translate-y-[-50%] bg-neutral p-24 rounded-full flex items-center text-neutral-content bg-opacity-0 group-hover:bg-opacity-50`}
              >
                <span className="hover:text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 cursor-pointer opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(index)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </span>
              </div>

              {/*  */}
              <Image
                className=" lg:h-full grow md:grow-0 select-none "
                width={800}
                height={800}
                src={image}
                alt=""
              />

              {/*  */}
              {imageListForModal.length > 1 && (
                <>
                  {/*  */}
                  <a
                    className={`${
                      imageListForModal.length == index + 1 && " hidden"
                    } top-[48%] right-2 absolute text-xl z-50 btn btn-sm btn-circle shadow-md shadow-gray-500 `}
                    key={`item${index + 1}`}
                    href={`#item${index + 1}`}
                  >
                    {`>`}
                  </a>
                  {/*  */}
                  <a
                    className={`${
                      index == 0 && " hidden"
                    } top-[48%] left-2 absolute text-xl z-50 btn btn-sm btn-circle shadow-md shadow-gray-500`}
                    key={`item${index - 1}`}
                    href={`#item${index - 1}`}
                  >
                    {`<`}
                  </a>
                  <span className="absolute left-1/2 right-1/2 translate-x-[-50%] bottom-3.5 w-max badge z-20  ">
                    {index + 1} of {imageListForModal.length}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div> 

      <div className="w-[90vw] lg:w-[75vw] overflow-x-auto grid grid-flow-col place-items-center h-[10vh]">
        {imageListForModal.map((item, index) => (
          <a
            key={`item${index}`}
            href={`#item${index}`}
            className={`${
              imageModalId == `#item${index}` &&
              " border-info bg-info text-white"
            }   rounded-box h-12 w-12 opacity-70 `}
          >
            <Image className="h-full w-full rounded-box" src={item} quality={0.2} width={64} height={64} alt={"img" + index} />
          </a>
        ))}
      </div>
    </dialog>
  );
};

export default ImageModal;
