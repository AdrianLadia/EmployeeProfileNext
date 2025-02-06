import React, { FC } from "react";

import Image from "next/image";

import { useAppContext } from "../GlobalContext";

import { Employee } from "../schemas/EmployeeSchema";

interface ImageInputProps {
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
}

const ImageInput: FC<ImageInputProps> = ({
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
}) => {
  const {
    handleImageModalClick,
    setImageModalId,
    imageListForModal,
    imageModalId,
  } = useAppContext();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const captureInputRef = React.useRef<HTMLInputElement>(null);

  const [hideTakePhoto, setHideTakePhoto] = React.useState(false);

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

      {/*  */}
      <div
        className="flex justify-between items-end mb-1 gap-1 min-h-10 "
        data-tip={`${mediaList?.length} images`}
      >
        <label htmlFor={id}>{title}</label>
        <div
          className={` h-[${imgDimensions?.height}px] w-[${imgDimensions?.width}px] relative group`}
          data-tip={`${mediaList?.length}`}
          onClick={() => {
            if (mediaList?.length) {
              handleImageModalClick(mediaList || []);
              setImageModalId(id);
            }
          }}
        >
          <Image
            className={`
              ${mediaList?.length && "cursor-pointer border "} 
              h-[${imgDimensions?.height}px] w-[${imgDimensions?.width}px] rounded-box
            `}
            height={imgDimensions?.height}
            width={imgDimensions?.width}
            alt={"   "}
            src={mediaList?.[0] || ""}
            
          />

          <span
            className={`${
              !mediaList?.length && "hidden"
            } absolute top-5 right-1/2 left-1/2 translate-x-[-50%] z-50 bg-base-300/70 group-hover:bg-base-300 items-center flex justify-center size-5 rounded-full cursor-pointer`}
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
                Take Photo
              </a>
            </li>
            <li>
              <a onClick={handleUploadClick}>
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
                    d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
                  />
                </svg>
                Upload
              </a>
            </li>
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

export default ImageInput;
