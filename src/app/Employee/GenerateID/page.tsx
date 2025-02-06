"use client";

import React, { useEffect, useState } from "react";
import GenerateIDForm from "./GenerateID";
import { Employee } from "@/app/schemas/EmployeeSchema.ts";

import { useAppContext } from "@/app/GlobalContext";

const Page = () => {
  const { serverRequests, userData } = useAppContext();

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeList = async () => {
      setIsLoading(true);
      try {
        const res = await serverRequests.fetchEmployeeList(userData, 1, 9999, null);
        console.log("Employee list:", res.data.data);
        setEmployeeList(res.data.data);
      } catch (error) {
        console.error("Error fetching employee list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeList();
  }, []); // Empty dependency array means it runs only once

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative">
      {isLoading ? (
        <p className="loading text-info text-xl"></p>
      ) : (
        <GenerateIDForm employeeList={employeeList} />
      )}
    </div>
  );
};

export default Page;
