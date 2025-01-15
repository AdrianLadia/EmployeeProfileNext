"use client";

import React, { useEffect, useState, FC } from "react";

import { DataToUpdate } from "@/app/Schema";

import { Employee } from "@/app/schemas/EmployeeSchema";

import { useAppContext } from "@/app/GlobalContext";

// import Image from 'next/image'

import ImageInput from "@/app/InputComponents/ImageInput";

import FirebaseUpload from "@/app/api/FirebaseUpload";
import Select from "react-select";

import SelectPlus from "@/app/InputComponents/SelectPlus";

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
  } = useAppContext();

  const upload = new FirebaseUpload();

  const formRef = React.useRef<HTMLFormElement>(null);

  const [disable, setDisable] = useState(true);
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  const [dataToUpdate, setDataToUpdate] = useState<DataToUpdate>({});

  const defaultFormData = {
    _id: "",
    name: "",
    address: null,
    phoneNumber: null,
    photoOfPerson: null,
    resumePhotosList: null,
    biodataPhotosList: null,
    email: null,
    dateJoined: null,
    company: null,
    isRegular: null,
    isProductionEmployee: null,
    dailyWage: null,
  }; 

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    defaultFormData as Employee
  );
  const [formData, setFormData] = useState<Employee>(
    defaultFormData as Employee
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = await handleConfirmation(
      "Confirm Action?",
      `Update changes you've made for ${formData?.name}`,
      ""
    );

    setLoading(true);

    if (confirmed) {
      try {
        if (dataToUpdate?.photoOfPerson) {
          const res = await upload.Images(
            [formData.photoOfPerson || ""],
            `employees/${formData.name}`,
            "photoOfPerson"
          );
          dataToUpdate.photoOfPerson = res[0] || "";
        }

        if (dataToUpdate?.biodataPhotosList) {
          const res = await upload.Images(
            formData.biodataPhotosList || [],
            `employees/${formData.name}`,
            "biodataPhotosList"
          );
          dataToUpdate.biodataPhotosList = res || [];
        }

        if (dataToUpdate?.resumePhotosList) {
          const res = await upload.Images(
            formData.resumePhotosList || [],
            `employees/${formData.name}`,
            "resumePhotosList"
          );
          dataToUpdate.resumePhotosList = res || [];
        }

        const form = e.target as HTMLFormElement;

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
              e.target.id === "photoOfPerson" ? fileDataUrls[0] : fileDataUrls;

            setFormData({
              ...formData,
              [e.target.id]: finalResult,
            });

            setDataToUpdate({
              ...dataToUpdate,
              [e.target.id]: finalResult,
            });
          }
        };
      }
    }
  };

  useEffect(() => {
    if (selectedEmployee?.name) {
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
  }, [selectedEmployee, formData]);

  const labelStyle = `${selectedEmployee?._id ? "" : "text-gray-300"}`;

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

    const [companyOptions] = useState([
      { label: "Paper Boy", value: "PPB" },
      { label: "Pustanan", value: "PPC" },
      { label: "Best Bags", value: "BB" },
      { label: "Starpack", value: "SP" },
    ] as { label: string; value: string }[]); 
  

  return (
    <form
      className={` ${loading && "cursor-wait"} form-style `}
      ref={formRef}
      onSubmit={(e) => handleSubmit(e)}
    >
      <h2 className="font-semibold">Update Employee</h2>

      {/* employee */}
      {/* <div className='flex flex-col text-sm gap-2 '>Employee to Edit
            <select className="select select-bordered w-full " id='Employee' required
                value={formData?._id || ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                    const selectedIndex = e.target.options.selectedIndex - 1
                    setSelectedEmployee(employeeList[selectedIndex])
                    setFormData(employeeList[selectedIndex])
                }} 
            >
                <option disabled selected value={""}>Select Employee</option>
                {employeeList&&employeeList.map((employee, index) => (
                    <option key={index} value={employee?._id || ""} >{employee?.name}</option>
                ))}
                <option value="null">None</option>
            </select>
        </div> */}

      <Select
        styles={selectStyle}
        options={employeeList}
        placeholder="Select Employee"
        getOptionLabel={(option) => option.name}
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
      <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
            disabled={disable}
            value={formData?.name || ""}
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* address */}
      <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
        Address
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

      {/* Phone Number */}
      <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
            disabled={disable}
            value={formData?.phoneNumber || ""}
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* photoOfPerson, resume, bioData */}
      <div
        className={
          "flex flex-wrap gap-3 md:gap-2 justify-between w-full " + labelStyle
        }
      >
        {/* photoOfPerson */}
        <ImageInput
          id="photoOfPerson"
          title="Photo Of Person"
          width="w-full"
          inputStyle="file-input file-input-bordered sw-full max-w-full file-input-xs h-10"
          imgDimensions={{ height: 60, width: 60 }}
          mediaList={[formData?.photoOfPerson || ""]}
          onChangeHandler={handleFileChange}
          disable={disable}
        />
        {/* <label htmlFor="photoOfPerson" className='text-sm flex flex-col w-full'>
                <div className='flex justify-between items-center mb-1 gap-1 relative'>Photo Of Person  
                    <Image src={formData?.photoOfPerson } className='h-[60px]' height={60} width={60} alt="photoOfPerson" /> 
                </div>
                <input type="file" className="file-input file-input-bordered sw-full max-w-full file-input-xs h-10" id='photoOfPerson' accept='image/*' 
                    onChange={handleFileChange} disabled={disable}/>
            </label> */}

        {/* resumePhotosList */}
        <ImageInput
          id="resumePhotosList"
          title="Resume"
          width="w-full md:w-[48%]"
          inputStyle="file-input file-input-bordered w-full max-w-full file-input-xs h-10"
          imgDimensions={{ height: 60, width: 60 }}
          mediaList={formData?.resumePhotosList || []}
          onChangeHandler={handleFileChange}
          disable={disable}
          multiple={true}
        />
        {/* <label htmlFor="resumePhotosList" className='text-sm flex flex-col w-full md:w-[48%]'>
                <div className='flex justify-between items-center mb-1 gap-1 relative '>Resume  
                    <Image src={formData?.resumePhotosList[0] } className='h-[60px]' height={60} width={60} alt="resumePhotosList" /> 
                </div>
                <input type="file" className="file-input file-input-bordered w-full max-w-full file-input-xs h-10" id='resumePhotosList' accept='image/*' 
                    onChange={handleFileChange} disabled={disable} multiple/>
            </label> */}

        {/* biodataPhotosList */}
        <ImageInput
          id="biodataPhotosList"
          title="Bio Data"
          width="w-full md:w-[48%]"
          inputStyle="file-input file-input-bordered w-full max-w-full file-input-xs h-10"
          imgDimensions={{ height: 60, width: 60 }}
          mediaList={formData?.biodataPhotosList || []}
          onChangeHandler={handleFileChange}
          disable={disable}
          multiple={true}
        />
        {/* <label htmlFor="biodataPhotosList" className='text-sm flex flex-col w-full md:w-[48%]'>
                <div className='flex justify-between items-center mb-1 gap-1  '>Bio Data  
                    <Image src={formData?.biodataPhotosList[0] } className='h-[60px]' height={60} width={60} alt="biodataPhotosList" />  
                </div>
                <input type="file" className="file-input file-input-bordered w-full max-w-full file-input-xs h-10" id='biodataPhotosList' accept='image/*' 
                    onChange={handleFileChange} disabled={disable} multiple/>
            </label> */}
      </div>

      {/* E-mail */}
      <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
            onChange={handleInputChange}
            disabled={disable}
          />
        </label>
      </div>

      {/* date Joined*/}
      <label className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
          onChange={handleInputChange}
          disabled={disable}
        />
      </label>

      {/* company */}
      <div className="flex flex-wrap justify-between text-sm gap-2 ">
          <div className="flex flex-col text-sm gap-2 w-full">
            Company
            <SelectPlus
              options={companyOptions}
              disabled={disable}
              defaultValue={formData?.company ? formData.company.toString() : ""}
              onChange={(e, newValue) => { 
                const valueToPass = typeof newValue == 'object' ? newValue?.value : newValue? newValue : null
                setFormData({ ...formData, company: valueToPass });
              }}
            />
          </div>
        </div> 

      {/* company */}
      {/* <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
            onChange={handleInputChange}
            disabled={disable}
          />
        </label>
      </div> */}

      <div className={"grid grid-cols-1 md:grid-cols-2 gap-2 "}>
        {/* isRegular */}
        <label className="label cursor-pointer flex justify-start gap-2 w-max">
          <p className={"label-text text-base " + labelStyle}>Is Regular?</p>
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
        {/* isProductionEmployee */}
        <label className="label cursor-pointer flex justify-start gap-2 w-max">
          <p className={"label-text text-base " + labelStyle}>
            Is Production Employee?
          </p>
          <input
            type="checkbox"
            className="checkbox"
            id="isProductionEmployee"
            disabled={disable}
            checked={formData?.isProductionEmployee || false}
            onChange={(e) => {
              setFormData({
                ...formData,
                isProductionEmployee: e.target.checked,
              });
              setDataToUpdate({
                ...dataToUpdate,
                isProductionEmployee: e.target.checked,
              });
            }}
          />
        </label>
      </div>

      {/* Daily wage */}
      <div className={`flex flex-col text-sm gap-2 ${labelStyle}`}>
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
            disabled={disable}
            value={formData?.dailyWage || ""}
            onChange={handleInputChange}
          />
        </label>
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
