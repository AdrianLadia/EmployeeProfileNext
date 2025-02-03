import React from "react";

import CreateMemoForm from "./CreateMemoForm";

import { Offense, Employee } from "@/app/schemas/MemoSchema";

import ServerRequests from "@/app/api/ServerRequests";

import { getUserData, getTestUserData } from "../../api/UserData";

import { User } from "../../schemas/UserSchema";

export const metadata = {
  title: "| Create Memorandum",
  description: "Create Memo Form",
};

const page = async () => {
  const serverRequests = new ServerRequests();

    let userData: User;
  
    if (process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV === "true") {
      userData = await getTestUserData();
    } else {
      userData = await getUserData();
    }

  const [employeeRes, offenseRes] = await Promise.all([
    serverRequests.fetchEmployeeList(userData, 1, 9999, null),
    serverRequests.fetchOffenseList(),
  ]);

  if(!employeeRes?.data || !offenseRes?.data) { 
    return <div>Failed to fetch data</div>
  }

  const employeeList: Employee[] = employeeRes?.data?.data || [];
  const offenseList: Offense[] = offenseRes?.data || [];

  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className={` form-container `}>
        <CreateMemoForm employeeList={employeeList} offenseList={offenseList} />
      </div>
    </div>
  );
};

export default page;
