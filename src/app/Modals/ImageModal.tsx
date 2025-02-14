import React from "react";

import { useAppContext } from "../GlobalContext";

import Image from "next/image";

const ImageModal = () => {
  const { imageListForModal, setImageListForModal, router, imageModalId } =
    useAppContext();

  const imageModalRef = React.useRef<HTMLDialogElement>(null);

  const [hash, setHash] = React.useState("#item0");

  const handleClose = () => {
    setHash("#item0");
    router.replace(window.location.pathname, undefined);
  };

  const handleDelete = (index: number) => {
    const filtered = imageListForModal.filter((_, i) => i !== index);
    setImageListForModal(filtered);
  };

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
    <dialog id="imageModal" className="modal w-full " ref={imageModalRef}>
      <div className="modal-box bg-transparent shadow-none gap-2 flex flex-col w-full h-full justify-center items-center relative ">
        <div className="carousel h-max w-full bg-base-100 ">
          {imageListForModal.map((item, index) => (
            <div
              key={`item${index}`}
              id={`item${index}`}
              className="carousel-item w-full h-full relative items-center justify-center "
            >
              {/* delete image button */}
              <div
                key={`item${index}`}
                className={`${
                  !imageModalId ? " hidden " : " "
                } absolute top-2 left-2 btn btn-outline btn-accent btn-sm btn-circle z-40 duration-0 `}
                onClick={() => handleDelete(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-5 " 
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>

              <form className="absolute top-2 right-2" method="dialog">
                <button onClick={handleClose} className="close-button"></button>
              </form>

              {/* Image */}
              <Image
                src={item}
                loading="eager"
                className="h-max w-full"
                width={1000}
                height={1000}
                // fill
                // sizes="(max-width: 768px) 100vw, 700px"
                alt={`#item${index}`}
              />
            </div>
          ))}
          {/* <span className='absolute top-2 left-3 font-bold bg-white rounded-full w-8 h-8 grid place-content-center'>{index + 1}</span> */}
        </div>

        <div className="flex absolute bottom-0 z-50 gap-2">
          {imageListForModal.map((item, index) => (
            <a
              key={`item${index}`}
              href={`#item${index}`}
              onClick={() => setHash(`#item${index}`)}
              className={`${
                hash == `#item${index}` && " border-info bg-info text-white"
              } btn btn-sm `}
            >
              {index + 1}
            </a>
          ))}
        </div>
      </div>
    </dialog>
  );
};

export default ImageModal;
