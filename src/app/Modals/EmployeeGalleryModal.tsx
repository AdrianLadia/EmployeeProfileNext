import React from "react";

import { useAppContext } from "../GlobalContext";

import Confirmation from "../confirmation";

const EmployeeGalleryModal = () => {
  const {
    loading,
    setLoading,
    employeeForGallery,
    handleImageModalClick,
    handleConfirmation,
    serverRequests,
    userData,
  } = useAppContext();

  const captureInputRef = React.useRef<HTMLInputElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);

  const [employeeImageGallery, setEmployeeImageGallery] = React.useState<
    string[]
  >([]);

  const [showMenu, setShowMenu] = React.useState(false);

  const [addedImages, setAddedImages] = React.useState<string[]>([]);

  const handleTakePhotoClick = () => {
    if (captureInputRef?.current) {
      captureInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (uploadInputRef?.current) {
      uploadInputRef.current.click();
    }
  };

  const handleClose = () => {
    setShowMenu(false);
  };

  const handleDeleteImage = async (index: number, key: string) => {
    setLoading(true);
    const confirmed = await handleConfirmation(
      "Are you sure?",
      "The Image will be Removed.",
      "error"
    );
    if (confirmed) {
      if (key === "new") {
        const newImages = [...addedImages];
        newImages.splice(index, 1);
        setAddedImages(newImages);
      } else if (key === "old") {
        const newImages = [...(employeeImageGallery || [])];
        newImages.splice(index, 1);
        setEmployeeImageGallery(newImages);
      } else {
        console.error("Invalid Key");
      }
    }
    setLoading(false);
  };

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
          setAddedImages((prev) => [reader.result as string, ...prev]);
        };
      }
    }
  };

  const handleSave = async () => {
    // employee: Employee, dataToUpdate: DataToUpdate, userObject: User
    setLoading(true);
    const confirmed = await handleConfirmation(
      "Are you sure save Changes?",
      "The Changes you've made will be Saved and will not be able to Revert.",
      "Success"
    );
    try {
      if (confirmed) {
        const finalData = [...addedImages, ...employeeImageGallery]; 
        const res = await serverRequests.updateEmployee(employeeForGallery, {
          employeeImageGallery: finalData
        }, userData);

        console.log(res)

        if (res?.data) {
          setEmployeeImageGallery(finalData);
          setAddedImages([]);
          setShowMenu(false);
        }

        if(res.error){
            throw new Error(res.error);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const AddImage = () => {
    return (
      <div className="grow h-[30vh] md:h-[40vh] w-full md:w-[25%] flex justify-center items-center border group duration-150 cursor-pointer rounded-box">
        {showMenu ? (
          <div className="flex flex-col items-center justify-evenly gap-2 w-full max-h-[100%] ">
            <button
              className="btn min-w-[50%] max-w-full"
              onClick={() => {
                handleUploadClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
              <span className="w-[60%] max-w-full">Upload</span>
            </button>
            <button
              className="btn min-w-[50%] md:hidden"
              onClick={() => {
                handleTakePhotoClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
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
              <span className="w-[60%] max-w-full">Take Photo</span>
            </button>

            {/*  */}
            <div
              className={`${
                !addedImages?.length && "hidden"
              } min-w-[50%] max-w-full flex justify-between items-center gap-2 pt-4 border-t mt-2`}
            >
              <button
                className="btn btn-error btn-outline w-[47%]"
                onClick={() => {
                  setAddedImages([]);
                }}
              >
                Clear
              </button>
              <button
                className="btn btn-info w-[47%]"
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={() => {
              setShowMenu(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
        )}
      </div>
    );
  };

  React.useEffect(() => {
    setEmployeeImageGallery(employeeForGallery?.employeeImageGallery || []);
  }, [employeeForGallery]);

  return (
    <dialog
      className={` !z-50 modal md:px-2 ${loading && " cursor-wait "} `}
      id="EmployeeGalleryModal"
    >
      <div className="w-full h-full flex flex-wrap justify-between gap-4 relative overflow-y-auto backdrop-blur-md rounded-box shadow-xl pb-12 px-2 md:px-4">
        {/* close button */}
        <form
          className=" w-full flex justify-end items-center sticky top-2 z-50"
          method="dialog"
          id="closeButton"
        >
          <button className=" close-button " onClick={handleClose}></button>
        </form>

        <Confirmation />

        {/* add image */}
        {AddImage()}

        {/* added images */}
        {addedImages.map((image, index) => (
          <div className=" grow border-4 border-info relative group rounded-box overflow-clip">
            <img
              src={image}
              key={index}
              alt="Employee"
              className=" w-full h-[40vh] select-none "
            />
            <div
              className="group-hover:bg-opacity-80 duration-200 bg-neutral rounded-full bg-opacity-0  
                size-[50%] top-[25%] left-[25%] absolute 
                flex items-center justify-evenly"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-neutral-content opacity-0 group-hover:opacity-100 hover:text-error cursor-pointer"
                onClick={() => {
                  handleDeleteImage(index, "new");
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-neutral-content opacity-0 group-hover:opacity-100 cursor-pointer hover:text-info"
                onClick={() => {
                  handleImageModalClick([addedImages[index]]);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          </div>
        ))}

        {employeeImageGallery.map((image, index) => (
          <div className="grow relative rounded-box overflow-clip group border-4 border-transparent">
            <img
              src={image}
              alt={`image${index}`}
              key={`image${index}`}
              className=" w-full grow h-[40vh] select-none relative"
            />
            <div
              className="group-hover:bg-opacity-80 duration-200 bg-neutral rounded-full bg-opacity-0  
                size-[50%] top-[25%] left-[25%] absolute 
                flex items-center justify-evenly"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-neutral-content opacity-0 group-hover:opacity-100 hover:text-error cursor-pointer"
                onClick={() => {
                  handleDeleteImage(index, "old");
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-neutral-content opacity-0 group-hover:opacity-100 cursor-pointer hover:text-info"
                onClick={() => {
                  handleImageModalClick(employeeImageGallery);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          </div>
        ))}

        {/* images */}
        {/* {imageListForGalleryModal.map((image, index) => (
          <div className=" grow max-h-[40vh] rounded-box overflow-clip relative">
            <img
              src={image}
              key={index}
              alt="Employee"
              className=" w-max  h-full select-none *:"
            />

            <div className="absolute group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-neutral-content opacity-0 group-hover:opacity-100 cursor-pointer hover:text-info"
                onClick={() => {
                  handleImageModalClick([addedImages[index]]);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </div>
          </div>
        ))} */}
      </div>

      <input
        className="hidden"
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />

      <input
        className="hidden"
        ref={captureInputRef}
        type="file"
        accept="image/*"
        capture
        onChange={handleFileChange}
      />
    </dialog>
  );
};

export default EmployeeGalleryModal;
