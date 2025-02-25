//server side rendering copy

import React from "react";

import { Employee } from "@/app/schemas/EmployeeSchema";

import { User } from "@/app/schemas/UserSchema";

import ServerRequests from "@/app/api/ServerRequests";

import EmployeeTable from "./Dashboard/EmployeeTable";
import DashMenu from "./Dashboard/DashboardMenu";
import EmployeeDetails from "./Dashboard/EmployeeDetails";
import SearchBar from "./Dashboard/SearchBar";

import { getUserData, getTestUserData } from "./api/UserData";

// import UploadOffenseButton from "./UploadOffenseButton";

export const metadata = {
  title: "| Dashboard",
  description: "Employee Dashboard",
};

const Page = async () => {
  const isTest =
    process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV == "true" ? true : false;

  const serverRequests = new ServerRequests();

  const userData: User = !isTest
    ? await getUserData()
    : await getTestUserData();

  const res = await serverRequests.getEmployeeForDashboardAction(
    userData,
    1,
    null
  );

  let employeeResponse;

  if (res?.data) {
    employeeResponse = res.data;
  }

  let fetchingError;

  let employeeList: Employee[] = [];

  let employeeListLength = 0;
  let regularEmployeeCount = 0;
  let newlyJoinedEmployeeCount = 0;
  let daysSinceJoined = 0;

  if (employeeResponse?.data) {
    employeeList = employeeResponse.data;

    employeeListLength = employeeList?.length;
    regularEmployeeCount = employeeList.filter(
      (employee) => employee.isRegular
    )?.length;
    newlyJoinedEmployeeCount = employeeList.filter((employee) => {
      daysSinceJoined =
        (new Date().getTime() - new Date(employee.dateJoined || "").getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceJoined <= 30;
    })?.length;
  } else if (employeeResponse?.error) {
    fetchingError = employeeResponse.error;
  }

  const cardStyle = `h-[25%] lg:h-[20%] first:w-full lg:first:w-[30%] w-full sm:w-[48%] lg:w-[30%] 
    hover:bg-base-300 hover:border-transparent overflow-y-auto md:overflow-y-clip
    pl-4 p-2 shadow-lg rounded-box flex flex-col items-start justify-evenly gap-2 border tracking-tighter`;

  return (
    <div className=" flex flex-col items-center justify-center h-max md:h-[100vh] ">
      {/* <ProfileMenu />   */}

      <div className="h-[1.5vh] md:h-0" />

      {/* <UploadOffenseButton/> */}

      <div className=" md:h-[93vh] overflow-auto lg:overflow-clip w-[99vw] lg:w-[97vw] justify-between flex flex-wrap ">
        <div className=" h-12 w-[45%] lg:w-[85%] flex items-center pl-4 gap-4 ">
          <DashMenu />
          <a href="/" className="text-2xl font-semibold tracking-wider">
            Dashboard
          </a>
        </div>

        {/* cards and table */}
        <div className="w-full 2xl:w-[60%] lg:w-[65%] h-max lg:h-[92%] flex flex-wrap items-center justify-between p-4 gap-4 lg:gap-0 ">
          {/* Employee Length */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold ">Employees</h3>
            <p className="text-4xl font-bold">{employeeListLength}</p>
            <span className="opacity-80 text-sm lg:hidden 2xl:block">
              Total Employee
            </span>
          </div>

          {/* Production Employee Count */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold ">Regular</h3>
            <p className="text-4xl font-bold">{regularEmployeeCount}</p>
            <span className="opacity-80 text-sm lg:hidden 2xl:block">
              Employee
            </span>
          </div>

          {/*  Newly Joined Employee Count */}
          <div className={cardStyle}>
            <h3 className="text-lg font-semibold ">New (30 Days)</h3>
            <p className="text-4xl font-bold">{newlyJoinedEmployeeCount}</p>
            <span className="opacity-80 text-sm lg:hidden 2xl:block">
              Employee
            </span>
          </div>

          {/* Table */}
          <div className="w-[100%] max-h-[95vh] lg:h-[75%] p-4 shadow-lg rounded-box flex flex-col items-start justify-between border ">
            <div className=" w-full overflow-auto h-full">
              <div className="flex flex-col md:flex-row p-1 justify-between items-center w-full">
                <h2 className="text-xl font-semibold tracking-tighter text-start sticky left-0 top-0 mb-2 w-full flex gap-2 items-center">
                  Employees
                  <a href="/Employee/Create" className="btn btn-xs btn-circle" title="Add Employee">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 -mt-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </a>
                </h2>
                <SearchBar controlled={true} />
              </div>

              <EmployeeTable
                employeeList={employeeList}
                fetchingError={fetchingError}
              />
            </div>
          </div>
        </div>

        {/* employee preview */}
        <div className="w-full 2xl:w-[40%] lg:w-[35%] max-h-[95vh] lg:h-[92%] flex flex-wrap justify-between py-6 px-4">
          <EmployeeDetails />
        </div>
      </div>
    </div>
  );
};

export default Page;
