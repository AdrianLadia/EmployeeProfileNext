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
      className="modal md:py-4 backdrop-blur-lg"
      ref={imageModalRef}
    >
      <div className="modal-box !p-0 !shadow-none gap-2 flex flex-col
        !md:max-w-[60%] w-full md:h-full md:min-h-full min-h-[100vh] h-[100vh] 
        justify-center items-center relative bg-transparent rounded-box"
      >
        <form className="absolute right-2 top-2 z-50 " method="dialog">
          <button onClick={handleClose} className="close-button"></button>
        </form>
        <div className="carousel w-full min-h-full">
          {imageListForModal.map((item, index) => (
            <div
              key={`item${index}`}
              id={`item${index}`}
              className="carousel-item w-full h-full !flex items-start relative "
            >
              {/* delete image button */}
              <div
                key={`item${index}`}
                className={`${
                  !imageModalId && " hidden "
                } absolute top-2 right-16 btn btn-sm btn-neutral btn-circle z-40 duration-0 `}
                onClick={() => handleDelete(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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

              <span className="absolute left-1/2 right-1/2 translate-x-[-50%] bottom-3.5 w-max badge z-20">
                {index + 1} of {imageListForModal.length}
              </span>

              {/*  */}
              <div className="min-h-full w-full flex items-center relative">
                {/*  */}
                <Image
                  src={item}
                  loading="lazy"
                  className=" h-max w-full "
                  width={500}
                  height={500}
                  alt={`#item${index}`}
                />

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
            </div>
          ))}
        </div>

        {/* <div className="flex absolute bottom-2 md:bottom-8 z-50 gap-2">
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
        </div> */}
      </div>
    </dialog>
  );
};

export default ImageModal;
