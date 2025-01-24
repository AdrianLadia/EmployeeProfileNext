"use client";

import React from "react";

import { Employee } from "@/app/schemas/EmployeeSchema.ts";

interface GenerateIDFormProps {
  employeeList: Employee[];
}

import EmployeeSelection from "./EmployeeSelection";
import GenerateEmployeeIDForm from "./GenerateEmployeeIDForm";  

const GenerateIDForm: React.FC<GenerateIDFormProps> = ({ employeeList }) => { 
  const [formData, setFormData] = React.useState<Employee>({} as Employee);

  const [hasEmptyFields, setHasEmptyFields] = React.useState<boolean>(false);

  const [phase, setPhase] = React.useState<1 | 2>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    console.log("submitted");
  };

  React.useEffect(() => {
    if (
      !(
        formData?.name &&
        formData?.address &&
        formData?.phoneNumber &&
        formData?.dateJoined
      )
    ) {
      setHasEmptyFields(true);
    }
  }, [formData]);  

  return (
    <>
      <div
        className={`h-[75vh] w-[96vw] md:w-[70vw] lg:w-[50vw] 2xl:w-[45vw] flex carousel shadow-xl border `}
      >  

        {/* select employee*/}
        <EmployeeSelection
          setPhase={setPhase}
          setHasEmptyFields={setHasEmptyFields}
          hasEmptyFields={hasEmptyFields}
          setFormData={setFormData}
          formData={formData}
          employeeList={employeeList}
        />

        {/* generate id */} 
          <GenerateEmployeeIDForm
          setPhase={setPhase}
          hasEmptyFields={hasEmptyFields}
          handleSubmit={handleSubmit}
        /> 
      </div>

      <ul className="steps absolute bottom-[2vh] text-xs w-[97%] md:w-[75%] lg:w-[55%] xl:w-[45%] 2xl:w-[40%]">
        <li className={` step step-primary `}>Choose Employee</li>
        <li className={` step ${phase == 2 && "step-primary"} `}>
          Generate ID
        </li>
      </ul>
    </>
  );
};

export default GenerateIDForm;
