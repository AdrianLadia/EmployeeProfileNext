import React from "react";

import Select from "react-select";

import { Employee } from "@/app/schemas/EmployeeSchema";
import { useAppContext } from "@/app/GlobalContext";

import Image from "next/image";

interface EmployeeSelectionProps {
  employeeList: Employee[];
  formData: Employee;
  setFormData: (employee: Employee) => void;
  setHasEmptyFields: (hasEmptyFields: boolean) => void;
  hasEmptyFields: boolean;
  setPhase: (phase: 1|2) => void;
}

const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({ employeeList, formData, setFormData, setHasEmptyFields, hasEmptyFields=false, setPhase }) => {
  const { router, pathname } = useAppContext(); 

  const handleSelectChange = (selectedOption: Employee): void => {
    if (selectedOption?._id != formData?._id) {
      setFormData(selectedOption as Employee);
      setHasEmptyFields(false);
    }
  }; 

  const selectStyle = {
    control: (base: unknown) => ({
      ...(base || {}),
      height: "4rem",
      backgroundColor: "transparent",
      borderRadius: "10px",
    }),
    singleValue: (base: unknown) => ({
      ...(base || {}),
      color: "inherit",
    }),
  };

  const renderEmployeeDetails = () => {
    const importantDetails = {
      name: formData?.name,
      phoneNumber: formData?.phoneNumber,
      dateJoined: formData?.dateJoined,
      address: formData?.address,
    };

    return (
      // formData?._id && (
      <>
        <div className="flex flex-wrap gap-4">
          {formData?.photoOfPerson ? (
            <Image
              src={formData?.photoOfPerson || ""}
              className="border border-info rounded-box w-[110px] h-[83.59px]"
              alt="photoOfPerson"
              height={100}
              width={100}
            ></Image>
          ) : (
            <div
              className={`${
                formData?._id&&!formData?.photoOfPerson ? " border-error text-error " : " border-gray-400 "
              } w-[110px] h-[83.59px] grid place-content-center border relative rounded-box`}
            >
              <strong>?</strong>
              <span className="absolute bottom-1 text-xs text-center w-full">
                PhotoOfPerson
              </span>
            </div>
          )}
          {Object.entries(importantDetails).map(([key, value]) => (
            <div key={key} className={` flex flex-col gap-1 grow justify-end md:w-[20vw] `}>
              <span
                className={`${
                  value ? " text-info " : formData?._id ? " text-error " : ""
                } font-semibold w-full capitalize`}
              >
                {key}
              </span>
              <p
                className={`${
                  value ? " input-info " : formData?._id ?" input-error " : " "
                } input input-bordered !min-h-[3rem] !h-max py-3 `}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </>
      // )
    );
  };

  return (
    <div
          className="carousel-item w-full flex flex-col h-full relative overscroll-contain"
          id="phase1"
        >
          <div className="h-[85%] w-full flex flex-col items-center py-5 overflow-auto">
            <Select
              id="Employee"
              styles={selectStyle || {}}
              options={employeeList}
              className="w-[90%]"
              placeholder="Select Employee"
              getOptionLabel={(option) => option.name}
              value={formData?._id ? formData : null}
              isClearable
              onChange={(selectedOption) => {
                const newValue = selectedOption as Employee;
                handleSelectChange(newValue);
              }}
            />

            <div className="w-[90%] border-b my-6 border-dashed" />
            <div className="flex flex-col w-[90%] gap-2 p-2 justify-center">
              {renderEmployeeDetails()} 
            </div>
          </div>

          {/* actions */}
          <div className="flex gap-2 justify-center absolute bottom-5 left-0 w-full ">
            <button
              onClick={() => {
                router.push("/Employee/Update#" + formData?._id);
              }}
              hidden={hasEmptyFields ? false : true}
              tabIndex={-1}
              className={`${
                hasEmptyFields && formData?._id ? " w-[43%] " : " hidden "
              } btn-ghost btn-outline btn h-12 `}
            >
              Update <i className="font-bold">{formData?.name}</i>
            </button>

            <button
              onClick={() => {
                setPhase(2);
                router.push(pathname + "#phase2");
              }}
              disabled={hasEmptyFields}
              tabIndex={-1}
              className={` ${
                hasEmptyFields && formData?._id ? " w-[43%] " : " w-[90%] "
              } btn-primary btn h-12 `}
            >
              Next
            </button>
          </div>
        </div>
  );
};

export default EmployeeSelection;
