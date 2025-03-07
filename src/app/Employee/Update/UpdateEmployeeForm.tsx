/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, FC } from "react";

import { DataToUpdate } from "@/app/Schema";

import { Employee } from "@/app/schemas/EmployeeSchema";

import { useAppContext } from "@/app/GlobalContext";

// import Image from 'next/image'

import MediaInput from "../../InputComponents/MediaInput";

import FirebaseUpload from "@/app/api/FirebaseUpload";
import Select from "react-select";

import SelectPlus from "@/app/InputComponents/SelectPlus";
import SignatureComponent from "../Signature/SignatureComponent";

interface UpdateEmployeeForm {
  employeeList: Employee[];
}

const UpdateEmployeeForm: FC<UpdateEmployeeForm> = ({ employeeList }) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    router,
    loading,
    setLoading,
    pathname,
    imageListForModal,
    imageModalId,
    setImageModalId,
  } = useAppContext();

  const upload = new FirebaseUpload();

  const formRef = React.useRef<HTMLFormElement>(null);

  const [disable, setDisable] = useState(true);
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const [updateSignature, setUpdateSignature] = useState(false);

  const [dataToUpdate, setDataToUpdate] = useState<DataToUpdate>({});

  const defaultFormData = {
    _id: "",
    lastName: "",
    firstName: "",
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
    employeeImageGallery: null,
  } as Employee;

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    defaultFormData as Employee
  );
  const [formData, setFormData] = useState<Employee>(
    defaultFormData as Employee
  );

  const [keysToUpdate, setKeysToUpdate] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `Update changes you've made for ${formData?.firstName}`,
      ""
    );

    setLoading(true);

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        if (dataToUpdate?.employeeSignature) {
          try {
            const res = await upload.Images(
              [formData.employeeSignature || ""],
              `employees/${formData.firstName} ${formData.lastName}`,
              "employeeSignature"
            );
            dataToUpdate.employeeSignature = res[0] || "";
          } catch (e) {
            console.error(e);
          }
        }

        const res = await serverRequests.updateEmployee(
          selectedEmployee,
          dataToUpdate,
          userData
        );

        if (res && res.message) {
          form.reset();
          setFormData(defaultFormData as Employee);
          setSelectedEmployee(defaultFormData as Employee);
          setDataToUpdate({});
          setToastOptions({
            open: true,
            message: res.message,
            type: "success",
            timer: 5,
          });
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
        console.error("Error Updating employee:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
        router.push(pathname);
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
    setDataToUpdate({
      ...dataToUpdate,
      [e.target.id]:
        e.target.id != "dailyWage"
          ? e.target.value
          : parseFloat(e.target.value),
    });
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
            setDataToUpdate({
              ...dataToUpdate,
              [id]: finalData,
            });
            setLoading(false);
          }
        };
      }
    }
  };

  useEffect(() => {
    if (selectedEmployee?.firstName) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    const stringFormData = JSON.stringify(formData);
    const stringSelectedEmployee = JSON.stringify(selectedEmployee);

    if (stringFormData == stringSelectedEmployee && selectedEmployee?._id) {
      setDisableSaveButton(true);
      setDataToUpdate({});
    } else {
      setDisableSaveButton(false);
    }

    if (formData?.employeeSignature == "") {
      setUpdateSignature(false);
    }
  }, [selectedEmployee, formData]);

  const labelStyle = (key?: string) => { 
    const style = `${
      !selectedEmployee?._id
        ? "text-gray-300"
        : key && keysToUpdate.includes(key as string)
        ? " !text-warning cursor-default w-max "
        : " text- "
    }`;
    return style;
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

  const [companyOptions, setCompanyOptions] = useState([
    { label: "Paper Boy", value: "PPB" },
    { label: "Pustanan", value: "PPC" },
    { label: "Best Bags", value: "BB" },
    { label: "Starpack", value: "SP" },
  ] as { label: string; value: string }[]);

  const [agencyOptions, setAgencyOptions] = useState([
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

  // onclick delete button from image modal, handler
  useEffect(() => {
    const nonArrayKeys = ["photoOfPerson", "employeeSignature"];
    const toPush = imageListForModal?.[0] ? imageListForModal[0] : null;
    if (imageListForModal && imageModalId) {
      setFormData({
        ...formData,
        [imageModalId]: nonArrayKeys.includes(imageModalId)
          ? toPush
          : imageListForModal,
      });
      setDataToUpdate({
        ...dataToUpdate,
        [imageModalId]: nonArrayKeys.includes(imageModalId)
          ? toPush
          : imageListForModal,
      });
    }
  }, [imageListForModal, imageModalId]);

  useEffect(() => {
    if (selectedEmployee?._id) {
      const res = companyOptions?.find(
        (company) => company.value == selectedEmployee.company
      );
      const res2 = companyOptions?.find(
        (company) => company.value == selectedEmployee.agency
      );

      if ((res == undefined || !res) && selectedEmployee?.company) {
        setCompanyOptions([
          ...companyOptions,
          {
            label: selectedEmployee?.company || "",
            value: selectedEmployee?.company || "",
          },
        ]);
      }

      if ((res2 == undefined || !res2) && selectedEmployee?.agency) {
        setAgencyOptions([
          ...agencyOptions,
          {
            label: selectedEmployee?.agency || "",
            value: selectedEmployee?.agency || "",
          },
        ]);
      }
    }
  }, [selectedEmployee]);

  useEffect(() => {
    const res = employeeList?.find(
      (employee) => employee._id == window.location.hash.split("#")[1]
    );

    const searchParams = new URLSearchParams(window.location.search);
    const keys = searchParams.getAll("key");

    setKeysToUpdate(keys);

    setSelectedEmployee(res as Employee);
    setFormData(res as Employee);
    setDisable(false);
    setDisableSaveButton(false);
  }, []);

  const employeeSignatureComponent = () => {
    return (
      <>
        {formData?.employeeSignature && !updateSignature ? (
          <div className="flex flex-col w-full items-center">
            <span className={`w-full ${labelStyle("employeeSignature")}`}>
              Employee Signature
            </span>
            <div className="flex flex-col items-center gap-2 border-2 border-black mt-2 rounded-box w-[84%] overflow-clip">
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
            titleStyle={` text-start ${labelStyle("employeeSignature")}`}
            setSignatureImageUrl={(url) => {
              if (url) {
                setFormData({ ...formData, employeeSignature: url });
                setDataToUpdate({ ...dataToUpdate, employeeSignature: url });
              } else {
                setDataToUpdate({ ...dataToUpdate, employeeSignature: null });
              }
              setUpdateSignature(false);
            }}
          />
        )}
      </>
    );
  };

  return (
    <form
      className={` ${loading && "cursor-wait"} form-style `}
      ref={formRef}
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="font-semibold text-violet-500">Update Employee</h2>

      <Select
        styles={selectStyle}
        options={employeeList}
        placeholder="Select Employee"
        getOptionLabel={(option) => option.firstName + " " + option.lastName}
        isClearable
        value={selectedEmployee?._id ? selectedEmployee : null}
        onChange={(selectedOption) => {
          setSelectedEmployee(selectedOption as Employee);
          setFormData(selectedOption as Employee);
        }}
        isLoading={loading}
        id="Employee"
      />

      <h2
        className=" text-center my-9 text-red-400 tracking-widest select-none"
        hidden={!disable}
      >
        {" "}
        Select an Employee First{" "}
      </h2>

      <div
        className="my-5 w-full border-b border-dashed border-gray-400"
        hidden={disable}
      />

      {/* name */}
      <div className={`flex flex-wrap justify-between text-sm gap-2 `}>
        <span
          className={`w-full md:w-[48%] order-1 ${labelStyle("firstName")}`}
        >
          First Name
        </span>
        <span
          className={`w-full md:w-[48%] order-3 md:order-2 ${labelStyle(
            "lastName"
          )}`}
        >
          Last Name
        </span>
        <label className="input input-bordered flex items-center gap-2 w-full md:w-[48%] order-2 md:order-3">
          <input
            type="text"
            className="grow"
            placeholder="First Name"
            id="firstName"
            disabled={disable}
            value={formData?.firstName || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2 w-full md:w-[48%] order-4">
          <input
            type="text"
            className="grow"
            placeholder="Last Name"
            id="lastName"
            disabled={disable}
            value={formData?.lastName || ""}
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* address */}
      <div className={`flex flex-col text-sm gap-2 `}>
        <span className={`${labelStyle("address")}`}>Address</span>

        <textarea
          className="textarea textarea-bordered"
          placeholder="Address"
          id="address"
          disabled={disable}
          value={formData?.address || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, address: e.target.value });
            setDataToUpdate({ ...dataToUpdate, address: e.target.value });
          }}
        ></textarea>
      </div>

      {/* phone and email */}
      <div className="flex flex-col gap-2 justify-between md:flex-row">
        {/* Phone Number */}
        <div className={`flex flex-col text-sm gap-2 w-full md:w-[48%]`}>
          <span className={`${labelStyle("phoneNumber")}`}>Phone Number</span>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Phone Number"
              id="phoneNumber"
              disabled={disable}
              value={formData?.phoneNumber || ""}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* E-mail */}
        <div className={`flex flex-col text-sm gap-2 w-full md:w-[48%]`}>
          <span className={`${labelStyle("email")}`}>E-mail</span>

          <label className="input input-bordered flex items-center gap-2">
            <input
              type="email"
              className="grow"
              placeholder="E-mail"
              id="email"
              value={formData?.email || ""}
              onChange={handleInputChange}
              disabled={disable}
            />
          </label>
        </div>
      </div>

      <div className="w-full border-b my-5" />

      {/* photoOfPerson, resume, bioData */}
      <div className={"flex flex-wrap gap-3 md:gap-4 justify-between w-full "}>
        {/* photoOfPerson */}
        <MediaInput
          id="photoOfPerson"
          title="Photo Of Person"
          width={"w-full"}
          value={formData?.photoOfPerson as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleFileChange(e);
          }}
          className={`${labelStyle("photoOfPerson")}`}
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
          className={`${labelStyle("resumePhotosList")}`}
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
          className={`${labelStyle("biodataPhotosList")}`}
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
          className={`${labelStyle("employeeHouseRulesSignatureList")}`}
        />
      </div>

      <div className="w-full border-b my-5" />

      {/* date Joined*/}
      <label className={`flex flex-col text-sm gap-2 `}>
        <span className={`${labelStyle("dateJoined")}`}>Date Joined</span>

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
          onChange={handleInputChange}
          disabled={disable}
        />
      </label>

      {/* agency */}
      <div
        className={`${
          formData?.isRegular && " hidden "
        } flex flex-wrap justify-between text-sm gap-2 `}
      >
        <div className="flex flex-col text-sm gap-2 w-full">
          <span className={`${labelStyle("agency")}`}>Agency</span>

          <SelectPlus
            options={agencyOptions}
            disabled={disable}
            defaultValue={formData?.agency?.toString() || undefined}
            onChange={(e, newValue) => {
              const valueToPass =
                typeof newValue == "object" &&
                newValue !== null &&
                newValue.value
                  ? (newValue as { value: string }).value?.toString()
                  : typeof newValue == "object" && newValue.value == null
                  ? null
                  : newValue
                  ? [newValue?.toString(), console.log(newValue)]
                  : null;
              setFormData({ ...formData, agency: valueToPass as string });
              setDataToUpdate({ ...dataToUpdate, agency: valueToPass });
            }}
          />
        </div>
      </div>

      {/* company */}
      <div className="flex flex-wrap justify-between text-sm gap-2 ">
        <div className="flex flex-col text-sm gap-2 w-full">
          <span className={`${labelStyle("company")}`}>Company</span>

          <SelectPlus
            options={companyOptions}
            disabled={disable}
            defaultValue={formData?.company?.toString() || undefined}
            onChange={(e, newValue) => {
              const valueToPass =
                typeof newValue == "object" &&
                newValue !== null &&
                newValue.value
                  ? (newValue as { value: string }).value?.toString()
                  : typeof newValue == "object" && newValue.value == null
                  ? null
                  : newValue
                  ? [newValue?.toString(), console.log(newValue)]
                  : null;
              setFormData({ ...formData, company: valueToPass as string });
              setDataToUpdate({
                ...dataToUpdate,
                company: valueToPass as string,
              });
            }}
          />
        </div>
      </div>

      {/* company role */}
      <div className={`flex flex-col text-sm gap-2 `}>
        <span className={`${labelStyle("companyRole")}`}>Company Role</span>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="companyRole"
            className="grow"
            placeholder="Company Role"
            id="companyRole"
            value={formData?.companyRole || ""}
            onChange={handleInputChange}
            disabled={disable}
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
          <span className={` ${labelStyle("isRegular")} `}>Is Regular?</span>
          <input
            type="checkbox"
            className="checkbox"
            id="isRegular"
            disabled={disable}
            checked={formData?.isRegular || false}
            onChange={(e) => {
              setFormData({ ...formData, isRegular: e.target.checked });
              setDataToUpdate({ ...dataToUpdate, isRegular: e.target.checked });
            }}
          />
        </label>

        {/* isOJT */}
        <label className="label cursor-pointer flex justify-start gap-2 w-max">
          <span className={` ${labelStyle("isOJT")} `}>Is OJT?</span>
          <input
            type="checkbox"
            className="checkbox"
            id="isOJT"
            disabled={disable}
            checked={formData?.isOJT || false}
            onChange={(e) => {
              setFormData({ ...formData, isOJT: e.target.checked });
              setDataToUpdate({ ...dataToUpdate, isOJT: e.target.checked });
            }}
          />
        </label>
      </div>

      {/* Daily wage */}
      <div className={`flex flex-col text-sm gap-2 `}>
        <span className={`label-text text-base ${labelStyle("dailyWage")}`}>
          Daily Wage
        </span>

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
            disabled={disable}
            value={formData?.dailyWage || ""}
            onChange={handleInputChange}
          />
        </label>
        <div className="w-full border-b my-5" />
        <div className="flex flex-col w-full text-sm gap-2 mt-2">
          {employeeSignatureComponent()}
        </div>
      </div>

      {/* submit */}
      <button
        className="btn bg-violet-500 text-white w-full place-self-start my-6 "
        type="submit"
        disabled={disableSaveButton || !formData?._id || loading}
        id="save"
      >
        {!loading ? "Update" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default UpdateEmployeeForm;
