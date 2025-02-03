"use client";

import React, { useState, useRef, useEffect } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { Memo } from "@/app/schemas/MemoSchema.ts";

// import Image from 'next/image';

import ImageInput from "@/app/InputComponents/ImageInput";

import FirebaseUpload from "@/app/api/FirebaseUpload";

import Select from "react-select";

import Image from "next/image";

interface CreateMemoFormProps {
  memoList: Memo[];
}

const SubmitMemoForm: React.FC<CreateMemoFormProps> = ({ memoList }) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    loading,
    setLoading,
    handleImageModalClick,
  } = useAppContext();

  const upload = new FirebaseUpload();

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Memo>({} as Memo);

  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]);

  const [submittedMemos, setSubmittedMemos] = useState<string[]>([]);

  const [filesChanged, setFilesChanged] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `Submit ${formData?.subject} for ${formData?.Employee?.firstName} ${formData?.Employee?.lastName} ?` ,
      ""
    );

    setLoading(true);

    if (confirmed) {
      try {
        const finalFormData = {
          ...formData,
        };

        if (filesChanged.includes("mediaList")) {
          try {
            const res = await upload.Images(
              formData?.mediaList || [],
              `employees/${formData?.Employee?.firstName} ${formData?.Employee?.lastName}`,
              "mediaList"
            );
            finalFormData.mediaList = res || [];
          } catch (e) {
            console.error(e);
          }
        }

        if (filesChanged.includes("memoPhotosList")) {
          try {
            const res = await upload.Images(
              formData?.memoPhotosList || [],
              `employees/${formData?.Employee?.firstName} ${formData?.Employee?.lastName}`,
              "memoPhotosList"
            );
            finalFormData.memoPhotosList = res || []; 
          } catch (e) {
            console.error(e);
          }
        }

        const form = e.target as HTMLFormElement;

        const res = await serverRequests.submitMemo(
          finalFormData,
          finalFormData.reason || "",
          userData
        );
        
        if (res && res.data) {
          setToastOptions({
            open: true,
            message: res?.message || "Memo created successfully",
            type: "success",
            timer: 5,
          });

          form.reset();
          setFormData({} as Memo);
          setSubmittedMemos([...submittedMemos, formData.description]);

          formRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          setToastOptions({
            open: true,
            message: res.error,
            type: "error",
            timer: 5,
          });
          throw new Error("Error Submitting Memo");
        }
      } catch (e: unknown) {
        console.error("Error Submitting Memo:", e);
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
      setLoading(false);
    }
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

          // Check if all files have been processed
          if (fileDataUrls.length === files.length) {
            const finalResult =
              e.target.id === "photoOfPerson" || e.target.id === "employeeSignature" ? fileDataUrls[0] : fileDataUrls;

            setFormData({
              ...formData,
              [e.target.id]: finalResult,
            });
            setFilesChanged([...filesChanged, e.target.id]);
          }
        };
      }
    }
  };

  const filterMemos = (memoList: Memo[]) => {
    const filteredMemos = memoList.filter(
      (memo) => !submittedMemos?.includes(memo.description) && !memo?.submitted
    );

    setFilteredMemos(filteredMemos);
  };

  useEffect(() => {
    filterMemos(memoList);
  }, [memoList, submittedMemos]); 

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

  // useEffect(() => {
  //   setFormData({
  //     ...formData,
  //     [imageModalId]: imageListForModal.length ? imageListForModal : null,
  //   });
  // }, [imageListForModal]);

  return (
    <form
      className={` form-style ${loading && " cursor-wait "} `}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <h2 className="font-semibold text-violet-500">Memorandum Submition</h2>

      {/* Memorandum to Submit */} 
      <Select
        styles={selectStyle}
        options={filteredMemos}
        placeholder="Select Memo"
        value={formData?._id ? formData : null}
        getOptionLabel={(option) =>
          `${option.Employee?.firstName} ${option.Employee?.lastName}, ${
            option?.MemoCode?.title
          } (${option?.date?.substring(5, 16)})` || ""
        }
        isClearable
        onChange={(selectedOption) => {
          setFormData(selectedOption as Memo);
        }}
        id="select-offense"
      />

      {/* date */}
      <label className="flex flex-col items-start gap-2 text-sm">
        Date
        <input
          type="date"
          className="grow input input-bordered w-full"
          placeholder="Date"
          id="date"
          value={
            formData?.date
              ? new Date(formData?.date).toISOString().split("T")[0]
              : ""
          }
        />
      </label>

      {/* employee */}
      <div className="flex flex-col text-sm gap-2 ">
        Employee
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Name"
            id="name"
            value={formData?.Employee?.firstName ? formData?.Employee?.firstName + " " + formData?.Employee?.lastName : ""}
          />
        </label>
      </div>

      {formData?.remedialAction && (
        <div className="flex flex-col text-sm gap-2 ">
          Memo Remedial Action
          <div className="input input-bordered flex items-center w-max text-error input-error">
            {formData?.remedialAction}
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
            value={formData?.subject || ""}
          />
        </label>
        {/* description */}
        <textarea
          className="textarea textarea-bordered whitespace-pre-line mt-1 min-h-[30vh]"
          placeholder="Description"
          id="description"
          value={formData?.description || ""}
        ></textarea>
      </div>

      {/* Reason */}
      <div className="flex flex-col gap-2 text-sm">
        Reason
        {/* Reason */}
        <textarea
          className="textarea textarea-bordered mt-1 min-h-[15vh] whitespace-pre-line"
          placeholder="Reason"
          id="reason"
          required={!formData?.memoPhotosList?.length}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, reason: e.target.value });
          }}
          value={formData?.reason || ""}
        ></textarea>
      </div>

      {/* medialist */}
      {formData?.mediaList?.[0] && (
        <div
          className={` flex items-center justify-between p-3 gap-3 bg-base-200 rounded-box text-sm `}
        >
          <p className="w-[25%] text-end ">Media List: </p>
          <div className="flex justify-evenly gap-3 w-[75%] ">
            <div
              className="relative w-32 h-32 group"
              onClick={() => handleImageModalClick(formData?.mediaList || [])}
            >
              <span
                className="font-semibold absolute grid place-content-center left-1/2 
              right-1/2 top-1/2 bottom-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs opacity-75 group-hover:opacity-100 bg-base-100 p-4 rounded-full cursor-pointer"
              >
                {formData?.mediaList?.length}
              </span>
              <Image
                src={formData?.mediaList?.[0]}
                alt="media"
                width={100}
                height={100}
                className="rounded-box cursor-pointer w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* medialist */}
      {/* <ImageInput
        id="mediaList"
        title="Photo"
        width="w-full"
        inputStyle="file-input file-input-bordered sw-full max-w-full file-input-xs h-10"
        imgDimensions={{ height: 60, width: 60 }}
        mediaList={formData?.mediaList || []}
        onChangeHandler={handleFileChange}
        required={false}
        multiple={true}
      />  */}

      {/* memoPhotosList */}
      <ImageInput
        id="memoPhotosList"
        title="Memo Photo"
        width="w-full"
        inputStyle="file-input file-input-bordered sw-full max-w-full file-input-xs h-10"
        imgDimensions={{ height: 60, width: 60 }}
        mediaList={formData?.memoPhotosList || []}
        // setFunction={setFormData}
        onChangeHandler={handleFileChange}
        required={!formData?.memoPhotosList?.length}
        multiple={true}
      />

      {/* submit */}
      <button
        className={` btn bg-violet-500 text-white w-full place-self-start my-6`}
        type="submit"
        disabled={loading ? true : formData?.subject ? false : true}
        id="submit-memo-btn"
      >
        {!loading ? "Submit" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default SubmitMemoForm;
