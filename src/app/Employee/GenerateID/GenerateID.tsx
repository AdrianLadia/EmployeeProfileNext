"use client";

import React from "react";

import { Employee } from "@/app/schemas/EmployeeSchema.ts";

import { useAppContext } from "@/app/GlobalContext";

interface GenerateIDFormProps {
  employeeList: Employee[];
}

import EmployeeSelection from "./EmployeeSelection";
import GenerateEmployeeIDForm from "./GenerateEmployeeIDForm";

const GenerateIDForm: React.FC<GenerateIDFormProps> = ({ employeeList }) => {
  const [formData, setFormData] = React.useState<Employee>({} as Employee);

  const [hasEmptyFields, setHasEmptyFields] = React.useState<boolean>(false);

  const [phase, setPhase] = React.useState<1 | 2>(1);

  const { setLoading, loading, serverRequests, userData } = useAppContext();

  const [idURL, setIdURL] = React.useState<{ front: string; back: string }>(
    {} as { front: string; back: string }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      let res;
      
      if(idURL.front && idURL.back){
        // res = await serverRequests.updateEmployeeID(userData, formData?._id || ""); 
        res = await serverRequests.generateEmployeeID(userData, formData);
      }else{
        res = await serverRequests.generateEmployeeID(userData, formData);
      }

      console.log(res);

      if (res?.error) {
        console.error(res.error);
      }

      if (res?.employeeID) {
        setIdURL(res.employeeID);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (
      !(
        formData?.firstName &&
        formData?.lastName &&
        formData?.address &&
        formData?.phoneNumber &&
        formData?.dateJoined &&
        formData?.photoOfPerson &&
        formData?.companyRole &&
        formData?.employeeSignature
      )
    ) {
      setHasEmptyFields(true);
    } else {
      fetchEmployeeID();
    }
    setIdURL({} as { front: string; back: string });
  }, [formData, hasEmptyFields]);

  const fetchEmployeeID = async () => {
    try {
      setLoading(true);

      const res = await serverRequests.getAllEmployeeID();

      const chosenID = res.data.find(
        (ID: {
          _id: string;
          name: string;
          companyRole: string;
          IDCardURL: { front: string; back: string };
        }) => ID._id == formData._id
      );

      if (chosenID) {
        setIdURL(chosenID.IDCardURL);
      }else{
        setIdURL({ front: "", back: "" });
      }

      

      if (res?.error) {
        console.error(res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={` ${phase==1?" shadow-xl border":""} overflow-x-hidden h-[75vh] w-[96vw] md:w-[70vw] lg:w-[50vw] 2xl:w-[45vw] flex carousel `}
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
          phase={phase}
          loading={loading}
          hasEmptyFields={hasEmptyFields}
          handleSubmit={handleSubmit}
          idURL={idURL}
        />
      </div>

      <ul className=" steps absolute bottom-[2vh] text-xs w-[97%] md:w-[75%] lg:w-[55%] xl:w-[45%] 2xl:w-[40%]">
        <li className={` step step-primary `}>Choose Employee</li>
        <li className={` step ${phase == 2 && "step-primary"} `}>
          Generate ID
        </li>
      </ul>
    </>
  );
};

export default GenerateIDForm;
