import React from "react";
// import React, { useEffect, useState } from "react";
import GenerateIDForm from "./GenerateID";
// import { Employee } from "@/app/schemas/EmployeeSchema.ts";

// import { useAppContext } from "@/app/GlobalContext";

import { Employee } from "../../schemas/EmployeeSchema.ts";

import ServerRequests from "@/app/api/ServerRequests";

import { getUserData, getTestUserData } from "../../api/UserData";

import { User } from "../../schemas/UserSchema";

const Page = async () => {
  const serverRequests = new ServerRequests();

  let userData: User;

  if (process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV === "true") {
    userData = await getTestUserData();
  } else {
    userData = await getUserData();
  }

  const res = await serverRequests.fetchEmployeeList(userData, 1, 9999, null);

  if (!res?.data) {
    return <div>Something went wrong</div>;
  }

  const employeeList: Employee[] = res?.data?.data;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative">
      {/* {isLoading ? (
        <p className="loading text-info text-xl"></p>
      ) : ( */}
      <GenerateIDForm employeeList={employeeList} />
      {/* )} */} 
    </div>
  );
};

export default Page;
