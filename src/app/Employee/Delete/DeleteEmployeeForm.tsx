"use client";

import React, { useState, useRef, FC } from "react";

// import { Employee } from '@/app/Schema'
import { Employee } from "@/app/schemas/EmployeeSchema.ts";

import { useAppContext } from "@/app/GlobalContext";

import Image from "next/image";
import Select from "react-select";

interface CreateEmployeeFormProps {
  employeeList: Employee[];
}

const DeleteEmployeeForm: FC<CreateEmployeeFormProps> = ({ employeeList }) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    router,
    handleImageModalClick,
    loading, setLoading
  } = useAppContext();

  const formRef = useRef<HTMLFormElement>(null);

  const defaultFormData = {
    _id: "",
    _version: 0,
    name: "",
    address: "",
    phoneNumber: "",
    photoOfPerson: "",
    resumePhotosList: [""],
    biodataPhotosList: [""],
    email: "",
    dateJoined: "",
    company: "",
    isRegular: false,
    isProductionEmployee: false,
    dailyWage: 0,
    isOJT: false,
  };

  const [formData, setFormData] = useState<Employee>(defaultFormData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `${formData?.name} will be Deleted forever!`,
      "error"
    );

    setLoading(true);

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        const res = await serverRequests.deleteEmployee(formData, userData);

        if (res.message) {
          setToastOptions({
            open: true,
            message: res.message,
            type: "success",
            timer: 5,
          });
          form.reset();
          setFormData(defaultFormData);
          formRef.current?.scrollIntoView({ behavior: "smooth" });
          router.refresh();
        } else {
          setToastOptions({
            open: true,
            message: res.error,
            type: "error",
            timer: 15,
          });
        }
      } catch (e: unknown) {
        console.error("Error deleting employee:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
      }
    }else{
      setLoading(false);
    }
  };

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
    <form
      className={` form-style `}
      ref={formRef}
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="font-semibold">Employee Deletion</h2>

      {/* employee */}
      {/* <div className='flex flex-col text-sm gap-2 '>Employee to Edit
            <select className="select select-bordered w-full " id='Employee'  
                value={formData?._id || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                    const selectedIndex = e.target.options.selectedIndex - 1
                    setFormData(employeeList[selectedIndex])
                }} 
            >
                <option disabled selected value={""}>Select Employee</option>
                {employeeList&&employeeList.map((employee, index) => (
                    <option key={index} value={employee?._id?.toString()}>{employee?.name}</option>
                ))}
                <option value="null">None</option>
            </select>
        </div> */}

      <Select
        id="Employee"
        styles={selectStyle || {}}
        options={employeeList}
        placeholder="Select Employee"
        getOptionLabel={(option) => option.name}
        value={formData?._id ? formData : null}
        isClearable
        onChange={(selectedOption) => {
          setFormData(selectedOption as Employee);
        }}
      />

      {/* name */}
      <div className="flex flex-col text-sm gap-2 ">
        Name
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
            value={formData?.name}
          />
        </label>
      </div>

      {/* address */}
      <div className="flex flex-col text-sm gap-2 ">
        Address
        <textarea
          className="textarea textarea-bordered"
          placeholder="Address"
          id="address"
          value={formData?.address || ""}
        ></textarea>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col text-sm gap-2 ">
        Phone Number
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Phone Number"
            id="phoneNumber"
            value={formData?.phoneNumber || ""}
          />
        </label>
      </div>

      {/* photoOfPerson, resume, bioData */}
      <div className="flex flex-wrap gap-3 justify-between w-full ">
        {/* photoOfPerson */}
        <label htmlFor="photoOfPerson" className="text-sm flex flex-col w-full">
          <div className="flex justify-evenly items-center mb-1 gap-1 relative bg-base-200 p-1 rounded-lg">
            Photo Of Person 
            <Image
              src={formData?.photoOfPerson || ""}
              className="h-[60px] cursor-pointer"
              height={100}
              width={100}
              alt="photoOfPerson"
              onClick={() =>
                handleImageModalClick([formData?.photoOfPerson || ""])
              }
            />
          </div>
        </label>
        {/* resumePhotosList */}
        <label
          htmlFor="resumePhotosList"
          className="text-sm flex flex-col w-full md:w-[48%]"
        >
          <div className="flex justify-evenly items-center mb-1 gap-1 p-1 bg-base-200 rounded-lg ">
            Resume 
            <Image
              src={formData?.resumePhotosList?.[0] || ""}
              className="h-[60px] cursor-pointer"
              height={100}
              width={100}
              alt="resumePhotosList"
              onClick={() =>
                handleImageModalClick(formData?.resumePhotosList || [])
              }
            />
          </div>
        </label>
        {/* biodataPhotosList */}
        <label
          htmlFor="biodataPhotosList"
          className="text-sm flex flex-col w-full md:w-[48%]"
        >
          <div className="flex justify-evenly items-center mb-1 gap-1 p-1 bg-base-200 rounded-lg ">
            Bio Data
            <Image
              src={formData?.biodataPhotosList?.[0] || ""}
              className="h-[60px] cursor-pointer"
              height={100}
              width={100}
              alt="biodataPhotosList"
              onClick={() =>
                handleImageModalClick(formData?.biodataPhotosList || [])
              }
            />
          </div>
        </label>
      </div>

      {/* E-mail */}
      <div className="flex flex-col text-sm gap-2 ">
        E-mail
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-500"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <input
            type="email"
            className="grow"
            placeholder="E-mail"
            id="email"
            value={formData?.email || ""}
          />
        </label>
      </div>

      {/* date */}
      <label className="flex flex-col items-start gap-2 text-sm">
        Date Joined
        <input
          type="date"
          className="grow input input-bordered w-full"
          placeholder="Date Joined"
          id="dateJoined"
          value={
            formData?.dateJoined
              ? new Date(formData?.dateJoined).toISOString().split("T")[0]
              : ""
          }
        />
      </label>

      {/* company */}
      <div className="flex flex-col text-sm gap-2 ">
        Company
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-500"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Company"
            id="company"
            value={formData?.company || ""}
          />
        </label>
      </div>

      <div className="flex flex-wrap w-full justify-between">
          {/* isRegular */}
          <label className="label cursor-pointer flex justify-start gap-2 w-max">
            <p className="label-text text-base">Is Regular?</p>
            <input
              type="checkbox"
              className="checkbox"
              id="isRegular"  
              checked={formData?.isRegular || false}
            />
          </label>
          {/* isProductionEmployee */}
          <label className="label cursor-pointer flex justify-start gap-2 w-max">
            <p className="label-text text-base">Is Production Employee?</p>
            <input
              type="checkbox"
              className="checkbox"
              id="isProductionEmployee"  
              checked={formData?.isProductionEmployee || false}
            />
          </label>
          {/* isOJT */}
          <label className="label cursor-pointer flex justify-start gap-2 w-max">
            <p className="label-text text-base">Is OJT?</p>
            <input
              type="checkbox"
              className="checkbox"
              id="isOJT"  
              checked={formData?.isOJT || false}
            />
          </label>
        </div> 

      {/* Daily wage */}
      <div className="flex flex-col text-sm gap-2 ">
        Daily Wage
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4 text-gray-500"
          >
            <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
            <path
              fillRule="evenodd"
              d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
              clipRule="evenodd"
            />
            <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
          </svg>

          <input
            type="number"
            className="grow"
            placeholder="Daily Wage"
            id="dailyWage"
            step={0.00001}
            value={formData?.dailyWage ?? ""}
          />
        </label>
      </div>

      {/* submit */}
      <button
        className="btn bg-red-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={formData?._id ? false : true}
        id="delete-employee-btn"
      >
        {!loading ? "Delete" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default DeleteEmployeeForm;
