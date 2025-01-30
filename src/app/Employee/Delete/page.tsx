import React from "react";

import DeleteEmployeeForm from "./DeleteEmployeeForm";

// import type { Employee } from '@/app/Schema';
import { Employee } from "../../schemas/EmployeeSchema.ts";

import { getUserData, getTestUserData } from "../../api/UserData";

import { User } from "../../schemas/UserSchema";

import ServerRequests from "@/app/api/ServerRequests";

export const metadata = {
  title: "| Delete Employee",
  description: "Employee Deletion Form",
};

const page = async () => {
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
    <div className="w-screen h-screen flex items-center justify-center ">
      <div className={` form-container `}>
        <DeleteEmployeeForm employeeList={employeeList} />
      </div>
    </div>
  );
};

export default page;
