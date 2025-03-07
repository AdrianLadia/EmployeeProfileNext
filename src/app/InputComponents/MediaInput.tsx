"use client";

import React from "react";

import { useAppContext } from "../GlobalContext";

import Image from "next/image";

interface FileInputProps extends React.ComponentPropsWithoutRef<"input"> {
  allowVideos?: boolean;
}

const MediaInput: React.FC<FileInputProps> = ({
  value,
  className,
  allowVideos = false,
  ...props
}) => {
  const {
    handleImageModalClick,
    handleVideoModalClick,
    loading,
    imageModalId,
    setImageModalId,
  } = useAppContext();

  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const [mediaType, setMediaType] = React.useState<"image" | "video">("image");

  const [isLoading, setIsLoading] = React.useState(false);

  const handleCameraClick = () => {
    if (cameraInputRef?.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (uploadInputRef?.current) {
      uploadInputRef.current.click();
    }
  };

  const handleVideoClick = () => {
    if (videoInputRef?.current) {
      videoInputRef.current.click();
    }
  };

  const handlePreview = () => (
    <div className="h-14 w-14 flex items-center justify-center bg-base-100 relative border overflow-clip rounded-box select-none mb-1">
      {isLoading ? (
        <div className={`loading !loading-md loading-dots h-full z-50`} />
      ) : mediaType === "image" ? (
        (Array.isArray(value) && value[0]) ||
        (typeof value === "string" && value) ? (
          <div
            className="relative w-full h-full cursor-pointer group"
            onClick={() => {
              setImageModalId(props.id as string);
              handleImageModalClick(Array.isArray(value) ? value : [value]);
            }}
          >
            <Image
              src={
                Array.isArray(value)
                  ? value[0]
                  : typeof value === "string"
                  ? value
                  : ""
              }
              layout="fill"
              objectFit="cover"
              alt="media"
            />
            {Array.isArray(value) && (
              <span className="absolute w-full h-full grid place-content-center ">
                <p className="px-2 bg-base-100/90 group-hover:bg-base-100/50 rounded-full">
                  {Array.isArray(value) && value.length}
                </p>
              </span>
            )}
          </div>
        ) : (
          <div
            className={`${
              isLoading && "loading !loading-md loading-dots cursor-wait "
            } grid place-content-center w-full h-full z-20 select-none `}
          >
            ?
          </div>
        )
      ) : (
        <div
          className="w-full h-full bg-base-100 flex items-center justify-center text-2xl text-accent-500 cursor-pointer"
          onClick={() => handleVideoModalClick(value as string)}
        >
          <span className="ml-1">▶</span>
        </div>
      )}
    </div>
  );

  React.useEffect(() => {
    if (loading && imageModalId == props.id) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading, imageModalId]);

  React.useEffect(() => {
    let mediaType: "image" | "video" = "image";

    if (Array.isArray(value)) {
      mediaType = value[0]?.includes("video") ? "video" : "image";
    } else if (typeof value === "string") {
      mediaType = value.includes("video") ? "video" : "image";
    }

    setMediaType(mediaType);
  }, [value]);

  const mediaInputStyle = () => {
    let style = "";

    if (!(Array.isArray(value) ? value[0] : value) && props.required) {
      style = ` tooltip-open tooltip-top tooltip `;
    }

    return ` ${style} `;
  };

  return (
    <div className={`"flex flex-col items-center gap-1 ${props.width} `}>
      {/* preview image */}
      <div className="flex justify-between w-full">
        <h2
          onClick={handleUploadClick}
          className={`text-sm place-self-end mb-2 ${className}`}
        >
          {props?.title}
        </h2>
        {handlePreview()}
      </div>

      {/* upload button */}
      <div
        className={` dropdown dropdown-top w-full ${mediaInputStyle()}`}
        data-tip={"Required"}
      >
        <div
          className={`${
            isLoading && "cursor-not-allowed pointer-events-none"
          } flex items-center w-full border py-0.5 m-0 rounded-lg h-[40px]`}
          tabIndex={0}
          role="button"
        >
          <div
            className={` grid place-content-center text-neutral-content bg-neutral rounded-lg rounded-r-none w-28 text-xs font-semibold h-[38px]`}
          >
            {isLoading ? (
              <span className="loading loading-dots"></span>
            ) : (Array.isArray(value) ? !value?.length : !value) ? (
              "Choose File"
            ) : Array.isArray(value) ? (
              `${value.length} File(s)`
            ) : (
              "1 File"
            )}
          </div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-lg px-1 py-0.5 z-50 min-w-28 p-0 shadow-sm border border-neutral mb-0.5 font-semibold"
        >
          <li onClick={handleUploadClick}>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              Photo
            </a>
          </li>
          <li onClick={handleCameraClick} className="md:hidden">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
              Camera
            </a>
          </li>
          <li
            onClick={handleVideoClick}
            className={`${!allowVideos && "hidden"}`}
          >
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Video
            </a>
          </li>
        </ul>
      </div>

      <input
        className="hidden"
        accept="image/*"
        type="file"
        name="uploadInputRef"
        id="uploadInputRef"
        ref={uploadInputRef}
        required={false}
        {...props}
      />
      <input
        className="hidden"
        accept="image/*"
        type="file"
        name="cameraInputRef"
        id="cameraInputRef"
        ref={cameraInputRef}
        required={false}
        capture
        {...props}
      />
      <input
        className="hidden"
        accept="video/mp4, video/mov"
        type="file"
        name="videoInputRef"
        id="videoInputRef"
        ref={videoInputRef}
        required={false}
        {...props}
      />
    </div>
  );
};

export default MediaInput;
