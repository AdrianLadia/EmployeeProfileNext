/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";

import { useAppContext } from "@/app/GlobalContext";

import MediaInput from "../../InputComponents/MediaInput";

import { Employee } from "@/app/schemas/EmployeeSchema";

import SelectPlus from "@/app/InputComponents/SelectPlus";

import SignatureComponent from "../Signature/SignatureComponent";

import FirebaseUpload from "@/app/api/FirebaseUpload";

const CreateEmployeeForm = () => {
  const [show, setShow] = useState(false);

  const upload = new FirebaseUpload();

  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    router,
    loading,
    setLoading,
    imageModalId,
    setImageModalId,
    imageListForModal,
  } = useAppContext();

  const formRef = useRef<HTMLFormElement>(null);

  const defaultFormData = {
    firstName: "",
    lastName: "",
    address: null,
    phoneNumber: null,
    photoOfPerson: null,
    resumePhotosList: null,
    biodataPhotosList: null,
    email: null,
    dateJoined: null,
    company: null,
    isRegular: null,
    companyRole: null,
    dailyWage: null,
    isOJT: null,
    employeeSignature: null,
    employeeHouseRulesSignatureList: null,
    agency: null,
    employeeImageGallery: null,
  } as Employee;

  const [formData, setFormData] = useState<Employee>(
    defaultFormData as Employee
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `${formData?.firstName} ${formData?.lastName} will be Created as an Employee`,
      "success"
    );

    setLoading(true);

    if (confirmed) {
      try {
        const finalFormData = {
          ...formData,
          _id: "",
          _version: 0,
        };

        if (formData.employeeSignature) {
          const employeeSignature = await upload.Images(
            [formData.employeeSignature],
            `employees/${formData.firstName}${formData.lastName}`,
            "employeeSignature"
          );
          finalFormData.employeeSignature = employeeSignature[0];
        }

        const form = e.target as HTMLFormElement;

        const res = await serverRequests.createEmployee(
          finalFormData,
          userData
        );

        if (res.message) {
          setToastOptions({
            open: true,
            message: res.message,
            type: "success",
            timer: 10,
          });
          form.reset();
          setFormData(defaultFormData as Employee);
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
        console.error("Error creating employee:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        // setConfirmSave(false);
        setLoading(false);
      }
    } else {
      // setConfirmSave(false);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.id != "dailyWage"
          ? e.target.value
          : parseFloat(e.target.value),
    });
  };

  const [companyOptions] = useState([
    { label: "Paper Boy", value: "PPB" },
    { label: "Pustanan", value: "PPC" },
    { label: "Best Bags", value: "BB" },
    { label: "Starpack", value: "SP" },
  ] as { label: string; value: string }[]);

  const [agencyOptions] = useState([
    {
      label: "FirstMulti Manpower Services",
      value: "FirstMulti Manpower Services",
    },
    {
      label: "EFM Staffing General Services",
      value: "EFM Staffing General Services",
    },
    {
      label: "Cite Technical Institute, Inc.",
      value: "Cite Technical Institute, Inc.",
    },
    { label: "Brigadier Security Agency", value: "Brigadier Security Agency" },
  ] as { label: string; value: string }[]);

  const [updateSignature, setUpdateSignature] = useState<boolean>(true);

  const employeeSignatureComponent = () => {
    return (
      <>
        {!updateSignature ? (
          <div className="flex flex-col w-full items-center ">
            <span className="w-full">Employee Signature</span>
            <div
              className="flex flex-col items-center gap-2 border-2 border-black mt-2 rounded-box w-[84%] overflow-clip h-max "
              // onClick={() => !formData?.employeeSignature&&setUpdateSignature(true)}
            >
              <div className="h-[300px] flex items-center justify-center relative w-full">
                <img
                  src={formData?.employeeSignature as string}
                  alt="Employee Signature"
                  className=" m-1 h-full w-max"
                />
              </div>
              <input
                className="p-2 hover:text-secondary-content hover:bg-secondary bg-base-100 w-full border-t-2 border-black"
                onClick={() => setUpdateSignature(true)}
                type="button"
                value="Update Signature"
              />
            </div>
          </div>
        ) : (
          <SignatureComponent
            title="Employee Signature"
            setSignatureImageUrl={(url) => {
              if (url) {
                setFormData({ ...formData, employeeSignature: url });
              }
              setUpdateSignature(false);
            }}
          />
        )}
      </>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const id = e.target.id as keyof Employee;

    if (files && files.length > 0) {
      const fileReaders = [];
      const fileDataUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.readAsDataURL(files[i]);

        reader.onloadend = async () => {
          fileDataUrls.push(reader.result as string);

          if (fileDataUrls.length === files.length) {
            setImageModalId(id);
            setLoading(true);
            const res = await upload.Images(fileDataUrls, `${id}`, id);
            const oldData =
              id !== "photoOfPerson" &&
              id !== "employeeSignature" &&
              Array.isArray(formData[id]) &&
              formData[id].length
                ? formData[id]
                : [];
            const finalData =
              id === "photoOfPerson" || id === "employeeSignature"
                ? res[0]
                : res.concat(oldData);

            setFormData({
              ...formData,
              [id]: finalData,
            });
            setLoading(false);
          }
        };
      }
    }
  };

  React.useEffect(() => {
    if (imageListForModal) {
      setFormData({
        ...formData,
        [imageModalId]: imageListForModal,
      });
    }
  }, [imageListForModal]);

  return (
    <form
      className={` ${loading && "cursor-wait"} ${
        !show && " !justify-center "
      } form-style `}
      ref={formRef}
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="font-semibold w-max text-blue-500">Employee Registry</h2>

      {/* name */}
      <div className="flex flex-wrap text-sm gap-2 justify-between">
        <span className="w-full md:w-[48%] order-1">First Name</span>
        <span className="w-full md:w-[48%] order-3 md:order-2">Last Name</span>
        <label className="input input-bordered flex items-center gap-2 w-full md:w-[48%] order-2 md:order-3">
          <input
            type="text"
            className="grow"
            placeholder="First Name"
            id="firstName"
            required
            onChange={handleInputChange}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full md:w-[48%] order-4 ">
          <input
            type="text"
            className="grow"
            placeholder="Last Name"
            id="lastName"
            required
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* more details button */}
      <div
        className="w-full flex justify-center select-none cursor-pointer"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <p className="w-full relative flex items-center text-center">
            <span className="flex-1 border-t border-dashed border-gray-300"></span>
            <span className="px-4 text-gray-400">
              Fields below are optional
            </span>
            <span className="flex-1 border-t border-dashed border-gray-300"></span>
          </p>
        ) : (
          <p className="flex items-center gap-2">Add More Details? <input className="btn btn-xs btn-neutral btn-outline" type="button" value="Yes" /></p>
        )}
      </div>

      <div
        className={`${
          show ? "flex flex-col w-full gap-4 opacity-100" : " -z-20 hidden "
        } `}
      >
        {/* address */}
        <div className="flex flex-col text-sm gap-2 ">
          Address
          <textarea
            className="textarea textarea-bordered"
            placeholder="Address"
            id="address"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormData({ ...formData, address: e.target.value });
            }}
          ></textarea>
        </div>

        {/* phone and email */}
        <div className="flex flex-col md:flex-row gap-2 justify-between">
          {/* Phone Number */}
          <div className="flex flex-col text-sm gap-2 w-full md:w-[48%]">
            Phone Number
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Phone Number"
                id="phoneNumber"
                onChange={handleInputChange}
              />
            </label>
          </div>

          {/* E-mail */}
          <div className="flex flex-col text-sm gap-2 w-full md:w-[48%]">
            E-mail
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="email"
                className="grow"
                placeholder="E-mail"
                id="email"
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>

        <div className="w-full border-b my-5" />

        {/* photoOfPerson, resume, bioData */}
        <div className="flex flex-wrap gap-3 md:gap-4 justify-between w-full ">
          {/* photoOfPerson */}
          <MediaInput
            id="photoOfPerson"
            title="Photo Of Person"
            width={"w-full"}
            value={formData?.photoOfPerson as string}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFileChange(e);
            }}
          />

          {/* resumePhotosList */}
          <MediaInput
            id="resumePhotosList"
            title="Resume"
            value={formData?.resumePhotosList || []}
            width={"w-full md:w-[48%]"}
            multiple={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFileChange(e);
            }}
          />

          {/* biodataPhotosList */}
          <MediaInput
            id="biodataPhotosList"
            title="Bio Data"
            value={formData?.biodataPhotosList || []}
            width={"w-full md:w-[48%]"}
            multiple={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFileChange(e);
            }}
          />

          {/* employeeHouseRulesSignatureList */}
          <MediaInput
            id="employeeHouseRulesSignatureList"
            title="House Rules Agreement"
            width={"w-full"}
            value={formData?.employeeHouseRulesSignatureList || []}
            multiple={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleFileChange(e);
            }}
          />
        </div>

        <div className="w-full border-b my-5" />

        {/* date */}
        <label className="flex flex-col items-start gap-2 text-sm">
          Date Joined
          <input
            type="date"
            className="grow input input-bordered w-full"
            placeholder="Date Joined"
            id="dateJoined"
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </label>

        {/* agency */}
        <div
          className={`${
            formData?.isRegular && " hidden "
          } flex flex-wrap justify-between text-sm gap-2 `}
        >
          <div className="flex flex-col text-sm gap-2 w-full">
            Agency
            <SelectPlus
              options={agencyOptions}
              onChange={(e, newValue) => {
                const valueToPass =
                  typeof newValue == "object" &&
                  newValue !== null &&
                  newValue.value
                    ? (newValue as { value: string }).value?.toString()
                    : typeof newValue == "object" && newValue.value == null
                    ? null
                    : newValue
                    ? [newValue?.toString()]
                    : null;
                setFormData({ ...formData, agency: valueToPass as string });
              }}
            />
          </div>
        </div>

        {/* company */}
        <div className="flex flex-wrap justify-between text-sm gap-2 ">
          <div className="flex flex-col text-sm gap-2 w-full">
            Company
            <SelectPlus
              options={companyOptions}
              onChange={(e, newValue) => {
                const valueToPass =
                  typeof newValue == "object" &&
                  newValue !== null &&
                  newValue.value
                    ? (newValue as { value: string }).value?.toString()
                    : typeof newValue == "object" && newValue.value == null
                    ? null
                    : newValue
                    ? [newValue?.toString()]
                    : null;
                setFormData({ ...formData, company: valueToPass as string });
              }}
            />
          </div>
        </div>

        {/* company role */}
        <div className="flex flex-col text-sm gap-2 ">
          Company Role
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="companyRole"
              className="grow"
              placeholder="Company Role"
              id="companyRole"
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="flex flex-wrap w-full justify-between">
          {/* isRegular */}
          <label
            className={`${
              formData?.agency && " hidden "
            } label cursor-pointer flex justify-start gap-2 w-max `}
          >
            <p className="label-text text-base">Is Regular?</p>
            <input
              type="checkbox"
              className="checkbox"
              id="isRegular"
              onChange={(e) =>
                setFormData({ ...formData, isRegular: e.target.checked })
              }
            />
          </label>
          {/* isOJT */}
          <label className="label cursor-pointer flex justify-start gap-2 w-max">
            <p className="label-text text-base">Is OJT?</p>
            <input
              type="checkbox"
              className="checkbox"
              id="isOJT"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isOJT: e.target.checked,
                })
              }
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
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="w-full border-b my-5" />

        {/* Employee Signature */}
        {/* <div className="flex flex-col w-full text-sm gap-2 mt-2">
          <SignatureComponent
            title="Employee Signature"
            setSignatureImageUrl={(url) => {
              setFormData({ ...formData, employeeSignature: url });
            }}
          />
        </div> */}
        {employeeSignatureComponent()}
      </div>

      {/* submit */}
      <button
        className="btn bg-blue-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={loading}
        id="submit"
      >
        {!loading ? "Create" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default CreateEmployeeForm;
