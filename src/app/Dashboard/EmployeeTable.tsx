"use client";

import React, { useEffect } from "react";

import { Employee } from "../schemas/EmployeeSchema";

import { useAppContext } from "../GlobalContext";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface EmployeeTableProps {
  employeeList: Employee[];
  fetchingError?: string;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employeeList,
  fetchingError,
}) => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    loading,
    setLoading,
    highlightText,
    setSearch,
    setToastOptions,
    router,
  } = useAppContext();

  const [filteredEmployeeList, setFilteredEmployeeList] =
    React.useState<Employee[]>(employeeList);

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (fetchingError) {
      setToastOptions({
        type: "error",
        message: fetchingError || "Error fetching data",
        timer: 5,
        open: true,
      });
    }
  }, [fetchingError]);

  useEffect(() => {
    setLoading(true);

    setSearch(search);

    const searchQuery = search?.toLowerCase() || "";

    const filteredListForTable = employeeList.filter(
      ({
        address,
        firstName,
        lastName,
        email,
        company,
        phoneNumber,
        dateJoined,
        isOJT,
      }) =>
        [
          address,
          firstName,
          lastName,
          firstName + " " + lastName,
          email,
          company,
          phoneNumber,
          dateJoined,
          isOJT ? "OJT" : "",
        ].some((field) => field?.toLowerCase().includes(searchQuery))
    );

    setFilteredEmployeeList(filteredListForTable.reverse() as Employee[]);
    setLoading(false);
  }, [search, employeeList]);

  return (
    <table
      className={`table w-full table-pin-rows ${
        !employeeList.length ? " h-[88%] " : " h-max "
      } `}
    >
      {/* head */}
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Company</th>
          <th className="min-w-[10px]"></th>
        </tr>
      </thead>
      <tbody>
        {filteredEmployeeList.map((employee) => (
          <tr
            key={employee.firstName}
            className={` ${
              selectedEmployee?.firstName == employee?.firstName
                ? "bg-base-300 "
                : "hover:bg-base-200 "
            }  ${loading ? "disabled cursor-wait" : ""}  `}
            onClick={() => !loading && setSelectedEmployee(employee)}
            title="Select Employee"
          >
            <th className="bg-opacity-0 backdrop-blur-md ">
              <div className="flex items-center gap-3 ">
                <div className="avatar ">
                  <div className="mask mask-squircle h-12 w-12 ">
                    {employee?.photoOfPerson ? (
                      <Image
                        src={employee?.photoOfPerson || ""}
                        loading="lazy"
                        alt="Avatar Tailwind CSS Component"
                        height={100}
                        width={100}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-base-200 grid place-items-center">
                        {" "}
                        ?{" "}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-start">
                  <div className="font-bold">
                    {highlightText(
                      employee?.firstName + " " + employee?.lastName
                    )}
                  </div>
                  <div className="text-sm opacity-80">
                    {highlightText(
                      employee.phoneNumber
                        ? employee.phoneNumber.toString()
                        : ""
                    )}
                  </div>
                </div>
              </div>
            </th>
            <td className="capitalize ">
              <div className="min-w-[45vw] md:min-w-[20vw]">
                {highlightText(
                  employee.address ? employee.address.toString() : ""
                )}
              </div>
            </td>
            <td>
              {highlightText(
                employee.company ? employee.company.toString() : ""
              )}
               {highlightText(employee.isOJT ? "(OJT)" : "")}
            </td>
            <td>
              <div
                className="dropdown dropdown-top dropdown-end"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-circle btn-neutral btn-outline border border-gray-400 bg-base-100"
                  title="Menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-5 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu border border-gray-300 bg-base-100 rounded-box w-max z-[1] p-0.5 shadow text-xs lg:text-sm font-semibold"
                >
                  <li title="Delete Employee">
                    <a
                      className=""
                      onClick={() =>
                        router.push(`/Employee/Delete#${employee?._id}`)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </a>
                  </li>
                  <li title="Update Employee">
                    <a
                      className=""
                      onClick={() =>
                        router.push(`/Employee/Update#${employee?._id}`)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.867 19.125h.008v.008h-.008v-.008Z"
                        />
                      </svg>
                      Update
                    </a>
                  </li>
                  <li title="Create Memo for Employee">
                    <a
                      className=""
                      onClick={() =>
                        router.push(`/Memo/Create#${employee?._id}`)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Create Memo
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))}
        {fetchingError ? (
          <tr>
            <td colSpan={3} className="text-center p-4">
              {fetchingError}
            </td>
          </tr>
        ) : !filteredEmployeeList.length ? (
          <tr>
            <td colSpan={3} className="text-center p-4">
              No results found
            </td>
          </tr>
        ) : null}
      </tbody>
      {/* foot */}
      <tfoot>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Company</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  );
};

export default EmployeeTable;
