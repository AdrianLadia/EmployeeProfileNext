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

  const [fullHeight, setFullHeight] = React.useState(true);

  const [showDelete, setShowDelete] = React.useState(false);

  return (
    <dialog
      id="imageModal"
      className="modal backdrop-blur-sm !p-0 !px-3"
      ref={imageModalRef}
    >
      {/*  */}
      <form
        className={`${
          !imageListForModal.length
            ? " !h-[100svh] items-center justify-center "
            : " justify-end "
        } z-[60] flex gap-4 w-full md:px-2 pt-2`}
        method="dialog"
      >
        <div
          className={`${
            !imageListForModal.length && "hidden"
          } btn btn-sm h-8 w-max px-4 btn-circle text-xs`}
          onClick={() => setFullHeight(!fullHeight)}
          title="Toggle"
        >
          {fullHeight ? "Contain Height" : "Max Height"}
        </div>

        <button
          onClick={handleClose}
          className={`${
            !imageListForModal.length &&
            " !size-32 !text-3xl !font-[300] !text-white "
          } close-button`}
        >
          {!imageListForModal.length && "X"}
        </button>
      </form>

      {/*  */}
      <div
        className={`${
          !imageListForModal.length && " hidden "
        } my-2 h-[80svh] w-[90vw] relative `}
      >
        <div className="carousel w-full h-full gap-1  overflow-hidden">
          {imageListForModal.map((image, index) => (
            <div
              className="carousel-item relative w-full grid place-items-center group overflow-y-auto z-40"
              key={`item${index}`}
              id={`item${index}`}
            >
              {/*  */}
              <div
                className={`${!imageModalId && " hidden "} ${
                  showDelete && "hidden"
                }
                absolute top-1/2 bottom-1/2 translate-y-[-50%] bg-neutral/60 p-24 rounded-full 
                flex items-center text-neutral-content `}
              >
                <span className="hover:text-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 cursor-pointer "
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
                className={`${
                  fullHeight
                    ? "  h-[80svh] w-full md:max-w-[80vw] "
                    : " h-max w-full md:w-min "
                } select-none `}
                width={800}
                height={800}
                src={image}
                alt=""
                onClick={() => {
                  setShowDelete(!showDelete);
                }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleViewImage(index + 1);
                    }}
                    // onClick={() => handleViewImage(index + 1)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // handleViewImage(index - 1);
                    }}
                    // onClick={() => handleViewImage(index - 1)}
                  >
                    {`<`}
                  </a>
                  {/* <span className="absolute left-1/2 right-1/2 translate-x-[-50%] bottom-3.5 w-max badge z-20  ">
                    {index + 1} of {imageListForModal.length}
                  </span> */}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] overflow-x-auto grid grid-flow-col place-items-center place-content-center gap-3 pt-2 ">
        {imageListForModal.map((item, index) => (
          <a
            key={`item${index}`}
            href={`#item${index}`}
            className={` rounded-box h-12 w-12 relative`}
            // onClick={() => handleViewImage(index)}
          >
            <Image
              className="h-full w-full rounded-box border"
              src={item}
              quality={1}
              // layout="fill"
              // objectFit="cover"
              width={64}
              height={64}
              alt={"img" + index}
            />
          </a>
        ))}
      </div>
    </dialog>
  );
};

export default ImageModal;
