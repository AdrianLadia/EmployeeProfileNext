"use client";

import React, { useState, useRef } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { Memo, Employee, Offense } from "@/app/schemas/MemoSchema.ts";

// import Image from 'next/image';

import MediaInput from "@/app/InputComponents/MediaInput.tsx";

import FirebaseUpload from "@/app/api/FirebaseUpload.ts";

import Select from "react-select";

interface CreateMemoFormProps {
  employeeList: Employee[];
  offenseList: Offense[];
}

const CreateMemoForm: React.FC<CreateMemoFormProps> = ({
  employeeList,
  offenseList,
}) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    loading,
    setLoading,
    handleMemoPrintModalClick,
    imageListForModal,
    imageModalId,
  } = useAppContext();

  const [remedialAction, setRemedialAction] = useState<string>("");

  const upload = new FirebaseUpload();

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Memo>({
    reason: null,
    mediaList: null,
    memoPhotosList: null,
    withOffense: true,
  } as Memo);

  const [memoForPrint, setMemoForPrint] = useState<Memo | null>(null);

  const printMemo = async () => {
    try {
      const confirmed = await handleConfirmation(
        "Download Created Memo?",
        `${memoForPrint?.subject} for ${memoForPrint?.Employee?.firstName}`,
        "accent"
      );

      if (confirmed) {
        handleMemoPrintModalClick(memoForPrint as Memo);
      }
    } catch (e) {
      console.error("Error printing memo: ", e);
    } finally {
      setMemoForPrint(null);
    }
  };

  React.useEffect(() => {
    if (memoForPrint) {
      printMemo();
    }
  }, [memoForPrint]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `Create ${formData?.subject} for ${formData?.Employee?.firstName} ${formData?.Employee?.lastName}?`,
      "success"
    );

    setLoading(true);

    if (confirmed) {
      try {
        const finalFormData = {
          ...formData,
        };

        if (formData?.mediaList) {
          const isVideo = formData?.mediaList?.[0]?.includes("video")
            ? "/video"
            : "";
          const res = await upload.Images(
            formData?.mediaList,
            `employees/${formData?.Employee?.firstName} ${formData?.Employee?.lastName}${isVideo}`,
            "mediaList"
          );
          finalFormData.mediaList = res || [];
        }

        if (formData?.memoPhotosList) {
          const res = await upload.Images(
            formData?.memoPhotosList,
            `employees/${formData?.Employee?.firstName} ${formData?.Employee?.lastName}`,
            "memoPhotosList"
          );
          finalFormData.memoPhotosList = res || [];
        }

        const form = e.target as HTMLFormElement;

        const res = await serverRequests.createMemo(finalFormData, userData);

        if (res && res.data) {
          setMemoForPrint(res.data);

          setToastOptions({
            open: true,
            message: res?.message || "Memo created successfully",
            type: "success",
            timer: 5,
          });

          form.reset();
          setFormData({
            reason: null,
            mediaList: null,
            memoPhotosList: null,
          } as Memo);

          formRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          setToastOptions({
            open: true,
            message: res.error,
            type: "error",
            timer: 5,
          });
        }
      } catch (e: unknown) {
        console.error("Error creating Memo:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 5,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files?.length > 0) {
      const fileReaders = [];
      const fileDataUrls: string[] = [];

      for (let i = 0; i < files?.length; i++) {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.readAsDataURL(files[i]);

        reader.onloadend = () => {
          fileDataUrls.push(reader.result as string);

          // Check if all files have been processed
          if (fileDataUrls?.length === files?.length) {
            const finalResult =
              e.target.id === "photoOfPerson" ||
              e.target.id == "employeeSignature"
                ? fileDataUrls[0]
                : fileDataUrls;

            setFormData({
              ...formData,
              [e.target.id]: finalResult,
            });
          }
        };
      }
    }
  };

  const getRemedialAction = async (
    employeeId: string,
    offenseId: string,
    offenseVersion: number
  ) => {
    const res = await serverRequests.getRemedialActionForEmployeeMemoAction(
      userData,
      employeeId,
      offenseId,
      offenseVersion
    );
    if (res?.data?.remedialAction) {
      setRemedialAction(res.data.remedialAction);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value === "true" ? true : false,
    });
  };

  React.useEffect(() => {
    if (formData?.Employee?._id && formData?.MemoCode?._id) {
      getRemedialAction(
        formData?.Employee?._id,
        formData?.MemoCode?._id || "",
        formData?.MemoCode?._version || 0
      );
    } else {
      setRemedialAction("");
    }
  }, [userData, formData]);

  const selectStyle = {
    control: (base: unknown) => ({
      ...(base || {}),
      height: "3rem",
      backgroundColor: "transparent",
      borderRadius: "10px",
    }),
    singleValue: (base: unknown) => ({
      ...(base || {}),
      color: "inherit",
    }),
  };

  // onclick delete button from image modal, handler
  React.useEffect(() => {
    setFormData({
      ...formData,
      [imageModalId]: imageListForModal.length ? imageListForModal : null,
    });
  }, [imageListForModal, imageModalId]);

  React.useEffect(() => {
    const res = employeeList?.find(
      (employee) => employee._id == window.location.hash.split("#")[1]
    );
    setFormData({ ...formData, Employee: res as Employee });
  }, []);

  return (
    <form
      className={` ${loading && "cursor-wait"} form-style `}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <h2 className="font-semibold text-blue-500">Memorandum Creation</h2>

      <div className="flex flex-col gap-2">
        <span className="text-sm">Employee</span>
        <Select
          styles={selectStyle}
          options={employeeList}
          value={formData?.Employee ? formData.Employee : null}
          placeholder="Select Employee"
          getOptionLabel={(option) =>
            option.firstName + " " + option.lastName || ""
          }
          isClearable
          onChange={(selectedOption) => {
            setFormData({ ...formData, Employee: selectedOption as Employee });
          }}
          id="select-employee"
        />
      </div>

      {/* date */}
      <label className="flex flex-col items-start gap-2 text-sm">
        Date
        <input
          type="date"
          className="grow input input-bordered w-full"
          placeholder="Date"
          id="date"
          required
          onChange={handleInputChange}
        />
      </label>

      {/* with Offense */}
      <div className="flex flex-col gap-2">
        <span className="text-sm">Add Offense</span>
        <div className="flex gap-4">
          <label className="flex gap-2" htmlFor="withOffenseTrue">
            <input
              checked={formData.withOffense ? true : false}
              onChange={handleCheckboxChange}
              type="checkbox"
              id="withOffenseTrue"
              name="withOffense"
              value={"true"}
              className="checkbox checkbox- "
            />
            Yes
          </label>

          <label className="flex gap-2" htmlFor="withOffenseFalse">
            <input
              checked={formData.withOffense == false ? true : false}
              onChange={handleCheckboxChange}
              type="checkbox"
              id="withOffenseFalse"
              name="withOffense"
              value={"false"}
              className="checkbox checkbox- "
            />
            No
          </label>
        </div>
      </div>

      <div className={`${!formData?.withOffense && "hidden"} flex flex-col gap-2 `}>
        <span className="text-sm">Offense</span>
        <Select
          styles={selectStyle}
          options={offenseList}
          placeholder="Select Offense"
          value={formData?.MemoCode ? formData.MemoCode : null}
          getOptionLabel={(option) => `${option.title}` || ""}
          isClearable
          onChange={(selectedOption) => {
            setFormData({
              ...formData,
              MemoCode: selectedOption as Offense,
              subject: selectedOption?.title || "",
            });
          }}
          id="MemoCode"
        />
      </div>

      {remedialAction && (
        <div className="flex flex-col text-sm gap-2 ">
          Memo Remedial Action
          <div className="input input-bordered flex items-center w-max text-error input-error">
            {remedialAction}
          </div>
        </div>
      )}

      {/* memo */}
      <div className="flex flex-col gap-2 text-sm">
        Memo
        {/* subject */}
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
              clipRule="evenodd"
            />
            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
          </svg>

          <input
            type="text"
            className="grow placeholder:font-light"
            placeholder="Subject"
            id="subject"
            required
            value={formData?.MemoCode?.title? formData?.MemoCode?.title : formData?.subject || ""}
            onChange={handleInputChange}
          />
        </label>
        {/* description */}
        <textarea
          className="textarea textarea-bordered mt-1 min-h-[20vh]"
          placeholder="Description"
          id="description"
          required
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, description: e.target.value });
          }}
        ></textarea>
      </div>

      {/* medialist */}
      <MediaInput
        id="mediaList"
        title="Media Proof"
        width="w-full"
        inputStyle="file-input file-input-bordered sw-full max-w-full file-input-xs h-10"
        imgDimensions={{ height: 60, width: 60 }}
        mediaList={formData?.mediaList || []}
        onChangeHandler={handleFileChange}
        multiple={true}
        required={false}
        allowVideo={true}
      />

      {/* submit */}
      <button
        className="btn bg-blue-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={loading}
        id="create-memo-btn"
      >
        {!loading ? "Create" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default CreateMemoForm;
