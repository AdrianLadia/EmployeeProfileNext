"use client";

import React, { useState, useEffect, useRef } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { Memo } from "@/app/schemas/MemoSchema.ts";

import Image from "next/image";

import Select from "react-select";

interface DeleteMemoFormProps {
  memoList: Memo[];
}

const DeleteMemoForm: React.FC<DeleteMemoFormProps> = ({ memoList }) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    handleImageModalClick,
    loading, setLoading
  } = useAppContext();

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Memo>({} as Memo);

  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]);

  const [deletedMemos, setDeletedMemos] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `${formData?.subject} for ${formData?.Employee?.name} will be deleted FOREVER!`,
      "error"
    );

    setLoading(true); 

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        const res = await serverRequests.deleteMemo(formData, userData);

        if (res && res.data) {
          setToastOptions({
            open: true,
            message: res?.message || "Memo Deleted successfully",
            type: "success",
            timer: 5,
          });

          setDeletedMemos([...deletedMemos, formData?.description]);
          form.reset();
          setFormData({} as Memo);
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
        console.error("Error Deleting Memo:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const filterMemos = (memoList: Memo[]) => {
    const filteredMemos = memoList.filter(
      (memo) => !deletedMemos?.includes(memo.description) && !memo?.submitted
    );

    setFilteredMemos(filteredMemos);
  };

  useEffect(() => {
    filterMemos(memoList);
  }, [memoList, deletedMemos]);

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

  return (
    <form className={` form-style `} ref={formRef} onSubmit={handleSubmit}>
      <h2 className="font-semibold">Memorandum Deletion</h2>

      {/* Memorandum to Submit */}
      {/* <div className='flex flex-col text-sm gap-2 '>Memo to Delete 
        <select className="select select-bordered w-full " id='select-memo' required
          value={formData?.subject || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
            const selectedIndex = e.target.options.selectedIndex - 1
            setFormData(e.target.value=="null"?{} as Memo:{ ...filteredMemos[selectedIndex], reason: filteredMemos[selectedIndex].reason || '' })
          }}  
        >
          <option disabled selected value={""}>Select Memo </option>
          {filteredMemos&&filteredMemos.map((memo, index) => (
            <option key={index} value={memo?.subject}>{`${memo?.Employee?.name}, (${memo?.subject})`}</option>
          ))}
          <option value="null">None</option>
        </select>
      </div> */}
      <Select
        styles={selectStyle}
        options={filteredMemos}
        placeholder="Select Memo"
        value={formData?._id ? formData : null}
        getOptionLabel={(option) =>
          `${option.Employee?.name}, ${
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
            value={formData?.Employee?.name || ""}
          />
        </label>
      </div>

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
          className="textarea textarea-bordered mt-1 min-h-[20vh]"
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
          className="textarea textarea-bordered mt-1 min-h-[20vh]"
          placeholder="Reason"
          id="reason"
        ></textarea>
      </div>

      <div className="text-sm flex flex-col md:flex-row justify-evenly ">
        {/* medialist */}
        <div
          className={`${
            !formData?.mediaList?.[0] && "hidden"
          } cursor-pointer flex flex-col items-center mb-1 gap-1 w-full md:w-[48%] bg-base-200 pt-4 p-1 rounded-lg `}
          onClick={() => handleImageModalClick(formData?.mediaList || [])}
        >
          <Image
            src={formData?.mediaList?.[0] || ""}
            className={`${!formData?.mediaList?.[0] && "hidden"} h-[60px]`}
            height={100}
            width={100}
            alt="mediaList"
          />
          Photo 
        </div>
        {/* memoPhotosList */}
        <div
          className={`${
            !formData?.memoPhotosList?.[0] && "hidden"
          } cursor-pointer flex flex-col items-center mb-1 gap-1 w-full md:w-[48%] bg-base-200 pt-4 p-1 rounded-lg `}
          onClick={() => handleImageModalClick(formData?.memoPhotosList || [])}
        >
          <Image
            src={formData?.memoPhotosList?.[0] || ""}
            className={`${!formData?.memoPhotosList?.[0] && "hidden"} h-[60px]`}
            height={100}
            width={100}
            alt="memoPhotosList"
          />
          Memo Photo 
        </div>
      </div>

      {/* submit */}
      <button
        className="btn bg-red-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={formData?.subject ? false : true}
        id="delete-memo-btn"
      >
        {!loading ? "Delete" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default DeleteMemoForm;
