import React from "react";

export const metadata = {
  title: "| Generate ID",
  description: "Generate ID for Employee",
};

import GenerateIDForm from "./GenerateID";

import { Employee } from "@/app/schemas/EmployeeSchema.ts";

import ServerRequests from "@/app/api/ServerRequests";

const page = async () => {
  const serverRequests = new ServerRequests();

  const res = await serverRequests.fetchEmployeeList();

  const employeeList: Employee[] = res.data;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative ">
      <GenerateIDForm employeeList={employeeList} />
    </div>
  );
};

export default page;
