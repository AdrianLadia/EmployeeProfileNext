"use client";

import React from "react";

import { Employee } from "../schemas/EmployeeSchema";

import { useAppContext } from "../GlobalContext";

import FirebaseUpload from "../api/FirebaseUpload";

import Image from "next/image";

interface ProfileImageProps {
  employee: Employee;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ employee }) => {
  if (!employee?._id) {
    return null;
  }

  const {
    handleImageModalClick,
    handleConfirmation,
    serverRequests,
    userData,
    setToastOptions,
    router
  } = useAppContext();

  const upload = new FirebaseUpload();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const captureInputRef = React.useRef<HTMLInputElement>(null);

  const [uploadedPhoto, setUploadedPhoto] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);

  const containerStyle = `w-full h-full flex items-center justify-center bg-base-300 `;

  const handleViewImage = () => {
    handleImageModalClick([employee.photoOfPerson || ""]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    setLoading(true);

    const reader = new FileReader();

    reader.readAsDataURL(files[0]);

    reader.onloadend = () => {
      setUploadedPhoto(reader.result as string);
    };

    setLoading(false);

    const timeout = setTimeout(() => {
      handleSave(reader.result as string);
    }, 500);

    return () => clearTimeout(timeout);
  };

  const handleSave = async (image: string) => {
    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `Save Photo for ${employee?.firstName} ${employee?.lastName} `,
      "success"
    );

    if (confirmed) {
      try {

        let photoURL;

        if (image) {
          const uploadRes = await upload.Images(
            [image],
            `employees/${employee.firstName}${employee.lastName}`,
            "photoOfPerson"
          );

          console.log(uploadRes)

          photoURL = uploadRes[0];
        }

        // const res = await serverRequests.updateEmployee(
        //   employee,
        //   { photoOfPerson: photoURL },
        //   userData
        // );

        const res = await serverRequests.updateEmployeeProfilePicture(employee?._id || "", photoURL || "", userData);

        if (res?.data) {
          console.log(res.data)
          console.log("Image Successfully Saved");

          setToastOptions({
            open: true,
            message: "Photo Saved",
            type: "success",
            timer: 3,
          })

          router.refresh()
        }

        if (res?.error) {
          console.error(res.error);

          setToastOptions({
            open: true,
            message: res.error || "Error",
            type: "error",
            timer: 15,
          });
        }
      } catch (e) {
        console.error(e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Cancelled");
      setLoading(false);
    }
  };

  return (
    <div
      className={`${containerStyle} dropdown dropdown-bottom d p-0 bg-transparent `}
    >
      <input
        className="hidden"
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

      <div
        className="w-full h-full cursor-help"
        title="Profile"
        tabIndex={0}
        role="button"
      >
        {loading ? (
          <div
            className={`${containerStyle} text-2xl font-bold rounded-full ring-2 ring-neutral`}
          >
            <span className="loading text-info"></span>
          </div>
        ) : employee?.photoOfPerson ? (
          <Image
            className={` w-full h-full rounded-full ring-2 ring-neutral`}
            src={employee.photoOfPerson || "/avatar.png"}
            alt={employee?.firstName}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            loading="lazy"
          />
        ) : uploadedPhoto ? (
          <Image
            className={` w-full h-full rounded-full ring-2 ring-neutral`}
            src={uploadedPhoto}
            alt={employee?.firstName}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            loading="lazy"
          />
        ) : (
          <div
            className={`${containerStyle} text-2xl font-bold rounded-full ring-2 ring-neutral`}
          >
            ?
          </div>
        )}
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-max shadow border p-0 border-neutral font-semibold py-1 "
      >
        <li>
          <a onClick={handleViewImage}>
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
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            View Image
          </a>
        </li>
        <li hidden={window.innerWidth > 1023}>
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
  );
};

export default ProfileImage;
