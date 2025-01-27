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
  setPhase: (phase: 1 | 2) => void;
}

const EmployeeSelection: React.FC<EmployeeSelectionProps> = ({
  employeeList,
  formData,
  setFormData,
  setHasEmptyFields,
  hasEmptyFields = false,
  setPhase,
}) => {
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
      height: "3.6rem",
      backgroundColor: "transparent",
    }),
    singleValue: (base: unknown) => ({
      ...(base || {}),
      color: "inherit",
    }),
  };

  const renderEmployeeDetails = () => {
    const importantDetails = {
      name: [
        formData?.name,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4  "
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>,
      ],
      phoneNumber: [
        formData?.phoneNumber,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4  "
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
            clipRule="evenodd"
          />
        </svg>,
      ],
      dateJoined: [
        formData?.dateJoined,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 "
        >
          <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
          <path
            fillRule="evenodd"
            d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
            clipRule="evenodd"
          />
        </svg>,
      ],
      address: [
        formData?.address,
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4 "
        >
          <path
            fillRule="evenodd"
            d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clipRule="evenodd"
          />
        </svg>,
      ],
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
                formData?._id && !formData?.photoOfPerson
                  ? " border-error text-error "
                  : " border-gray-400 "
              } w-[110px] h-[83.59px] grid place-content-center border relative rounded-box pb-1.5`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="absolute bottom-1.5 text-xs text-center w-full">
                PhotoOfPerson
              </span>
            </div>
          )}
          {Object.entries(importantDetails).map(([key, value]) => (
            <div
              key={key}
              className={`${
                value[0] ? " text-info " : formData?._id ? " text-error " : ""
              } flex flex-col gap-1 grow justify-end md:min-w-[20vw] `}
            >
              <span className={`font-semibold w-full capitalize`}>{key}</span>

              <div
                className={`${
                  value?.[0]
                    ? " input-info "
                    : formData?._id
                    ? " input-error "
                    : " "
                } input input-bordered !min-h-[3rem] !h-max py-3 flex items-center grow `}
              >
                <span className="w-6 ">{value?.[1]}</span>
                <span className="w-[90%] text-base-content">
                  {key == "dateJoined"
                    ? value?.[0]?.toString().substring(0, 16)
                    : value?.[0]}
                </span>
              </div>
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
          } btn-outline btn h-12 `}
        >
          Update<i className="font-bold text-[1rem]">{formData?.name}</i>
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
