import React from "react";

import CreateMemoForm from "./CreateMemoForm";

import { Offense, Employee } from "@/app/schemas/MemoSchema";

import ServerRequests from "@/app/api/ServerRequests";

export const metadata = {
  title: "| Create Memorandum",
  description: "Create Memo Form",
};

const page = async () => {
  const serverRequests = new ServerRequests();

  const [employeeRes, offenseRes] = await Promise.all([
    serverRequests.fetchEmployeeList(),
    serverRequests.fetchOffenseList(),
  ]);

  const employeeList: Employee[] = employeeRes?.data || [];
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
