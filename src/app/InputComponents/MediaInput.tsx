import React, { FC } from "react";

import Image from "next/image";

import { useAppContext } from "../GlobalContext";

import { Employee } from "../schemas/EmployeeSchema";

interface MediaInputProps {
  id: string;
  title?: string;
  inputStyle?: string;
  width?: string;
  style?: string;
  imgDimensions?: { height: number; width: number };
  mediaList?: string[];
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setFunction?: (value: (prev: Employee) => Employee) => void;
  disable?: boolean;
  required?: boolean;
  multiple?: boolean;
  allowVideo?: boolean;
}

const MediaInput: FC<MediaInputProps> = ({
  id,
  title,
  width,
  inputStyle,
  imgDimensions,
  mediaList,
  onChangeHandler,
  setFunction,
  disable,
  required,
  multiple,
  allowVideo = false,
}) => {
  const {
    handleImageModalClick,
    setImageModalId,
    imageListForModal,
    imageModalId,
    handleVideoModalClick,
  } = useAppContext();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const captureInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const [hideTakePhoto, setHideTakePhoto] = React.useState(false);

  const [isVideo, setIsVideo] = React.useState(false);

  React.useEffect(() => {
    if (mediaList?.[0]?.toLowerCase()?.includes("video")) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [mediaList]);

  React.useEffect(() => {
    if (window.innerWidth > 1023) {
      setHideTakePhoto(true);
    }
  }, []);

  React.useEffect(() => {
    if (id == imageModalId) {
      if (setFunction) {
        setFunction((prev: Employee) => ({
          ...prev,
          [id]:
            id === "photoOfPerson" || id === "employeeSignature"
              ? imageListForModal[0]
              : imageListForModal,
        }));
      }
    }
  }, [imageListForModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const fileReaders = [];
      const fileDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.readAsDataURL(files[i]);

        reader.onloadend = () => {
          fileDataUrls.push(reader.result as string);

          // Check if all files have been processed
          if (fileDataUrls.length === files.length) {
            const finalResult =
              e.target.id === "photoOfPerson" ||
              e.target.id === "employeeSignature"
                ? fileDataUrls[0]
                : fileDataUrls;

            settingFunction(finalResult, e.target.id);
          }
        };
      }
    }
  };

  const settingFunction = (value: string | string[], id: string) => {
    if (setFunction) {
      setFunction((prev: Employee) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleTakePhotoClick = () => {
    if (captureInputRef?.current) {
      captureInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadVideoClick = () => {
    if (videoInputRef?.current) {
      videoInputRef.current.click();
    }
  };

  return (
    <div className={`flex flex-col ${width}`}>
      <input
        ref={captureInputRef}
        type="file"
        className={`hidden`}
        id={id}
        accept="image/*"
        capture
        required={required}
        disabled={disable}
        multiple={multiple}
        onChange={(setFunction && handleFileChange) || onChangeHandler}
      />

      <input
        ref={fileInputRef}
        type="file"
        className={`hidden`}
        id={id}
        accept="image/*"
        required={required}
        disabled={disable}
        multiple={multiple}
        onChange={(setFunction && handleFileChange) || onChangeHandler}
      />

      {allowVideo && (
        <input
          ref={videoInputRef}
          type="file"
          className={`hidden`}
          id={id}
          accept="video/mp4, video/mov"
          required={required}
          disabled={disable}
          onChange={(setFunction && handleFileChange) || onChangeHandler}
        />
      )}

      {/*  */}
      <div
        className="flex justify-between items-end mb-1 gap-1 min-h-10 "
        data-tip={`${mediaList?.length} images`}
      >
        <label htmlFor={id}>{title}</label>
        <div
          className={` h-[${imgDimensions?.height}px] w-[${imgDimensions?.width}px] relative group`}
          title={`${mediaList?.length || 0} File(s)`}
        >
          {!isVideo && (
            <Image
              className={`
              ${mediaList?.length && "cursor-pointer border "} 
              h-[${imgDimensions?.height}px] w-[${
                imgDimensions?.width
              }px] rounded-box
            `}
              height={imgDimensions?.height}
              width={imgDimensions?.width}
              alt={"   "}
              src={mediaList?.[0] || ""}
              onClick={() => {
                if (mediaList?.length) {
                  handleImageModalClick(mediaList || []);
                  setImageModalId(id);
                }
              }}
              
            />
          )}

          {isVideo && mediaList?.length && (
            <div
              className="h-14 w-14 border flex items-center justify-center cursor-pointer btn btn-outline indent-0.5"
              onClick={() => {
                if (mediaList?.length) {
                  handleVideoModalClick(mediaList?.[0] || "");
                }
              }}
            >
              ▶
            </div>
          )}

          <span
            className={`${!mediaList?.length && " hidden "} ${
              isVideo && " hidden "
            } absolute top-5 right-1/2 left-1/2 translate-x-[-50%] z-10 bg-base-300/70 group-hover:bg-base-300 items-center flex justify-center size-5 rounded-full cursor-pointer`}
            onClick={() => {
              if (mediaList?.length) {
                handleImageModalClick(mediaList || []);
                setImageModalId(id);
              }
            }}
          >
            {mediaList?.length}
          </span>
        </div>
      </div>

      {/*  */}
      <div className="dropdown dropdown-top ">
        <div className={`${inputStyle}`} role="button" tabIndex={0}>
          <div
            className={`${
              !disable
                ? "bg-neutral text-neutral-content hover:bg-neutral-500"
                : "bg-neutral-200 cursor-not-allowed"
            } h-full min-w-28 max-w-max font-semibold flex items-center justify-center px-3 select-none `}
          >
            {mediaList?.length
              ? ` ${mediaList?.length || 0} File(s)`
              : "Choose File"}
          </div>
          <ul
            tabIndex={0}
            className={`${
              disable && "hidden"
            } dropdown-content menu bg-base-100 rounded-box z-[1] border-2 border-neutral p-0.5 font-semibold `}
          >
            <li hidden={hideTakePhoto}>
              <a onClick={handleTakePhotoClick}>
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
            <li>
              <a onClick={handleUploadClick}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
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
            {allowVideo && (
              <li>
                <a onClick={handleUploadVideoClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                    />
                  </svg>
                  Video
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* <div className={inputStyle + " flex justify-between m-0 p-0"}>
        <input
          type="file"
          className={inputStyle + " border-0 outline-none text-transparent "}
          id={id}
          accept="image/*"
          capture
          required={required}
          disabled={disable}
          multiple={multiple}
          onChange={(setFunction && handleFileChange) || onChangeHandler}
        />
        <h3 className="h-full flex items-center px-8">
          {mediaList?.length || 0} File(s)
        </h3>
      </div> */}
    </div>
  );
};

export default MediaInput;
