import React from "react";

import UpdateEmployeeForm from "./UpdateEmployeeForm";

import { Employee } from "../../schemas/EmployeeSchema.ts";

import ServerRequests from "@/app/api/ServerRequests";

import { getUserData, getTestUserData } from "../../api/UserData";

import { User } from "../../schemas/UserSchema";

export const metadata = {
  title: "| Update Employee Details",
  description: "Employee Update Form",
};

const Page = async () => {
  const serverRequests = new ServerRequests();

  let userData: User;

  if (process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV === "true") {
    userData = await getTestUserData();
  } else {
    userData = await getUserData();
  }

  const res = await serverRequests.fetchEmployeeList(userData, 1, 9999, null);
  
  const employeeList: Employee[] = res.data.data; 
  
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="form-container">
        <UpdateEmployeeForm employeeList={employeeList} />
      </div>
    </div>
  );
};

export default Page;
