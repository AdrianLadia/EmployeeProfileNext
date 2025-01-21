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

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employeeList, fetchingError }) => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    loading,
    setLoading,
    highlightText,
    setSearch,
    setToastOptions
  } = useAppContext();

  const [filteredEmployeeList, setFilteredEmployeeList] =
    React.useState<Employee[]>(employeeList);

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    if(fetchingError){
      setToastOptions({
        type: "error",
        message: fetchingError||"Error fetching data",
        timer: 5,
        open: true, 
      });
    }
  },[fetchingError])

  useEffect(() => {
    setLoading(true);

    setSearch(search);

    const searchQuery = search?.toLowerCase() || ""; 

    const filteredListForTable = employeeList.filter(
      ({ address, name, email, company, phoneNumber, dateJoined, isOJT }) =>
        [address, name, email, company, phoneNumber, dateJoined, isOJT ? "OJT" : ""].some((field) =>
          field?.toLowerCase().includes(searchQuery)
        )
    );

    setFilteredEmployeeList(filteredListForTable as Employee[]);
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
        </tr>
      </thead>
      <tbody>
        {filteredEmployeeList.map((employee) => (
          <tr
            key={employee.name}
            className={`
                    ${
                      selectedEmployee?.name == employee?.name
                        ? "bg-base-300 "
                        : "hover:bg-base-200 "
                    } 
                    ${loading ? "disabled cursor-wait" : ""}  
                `}
            onClick={() => !loading && setSelectedEmployee(employee)}
            data-tip={"View"}
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
                    {highlightText(employee?.name)}
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
            <td>
              {highlightText(
                employee.address ? employee.address.toString() : ""
              )}
            </td>
            <td>
              {highlightText(
                employee.company ? employee.company.toString() : ""
              )}
               
              {highlightText(
                employee.isOJT ? "(OJT)" : ""
              )}

              {/* {employee.isOJT && (
                <span className="text-xs text-gray-500"> (OJT)</span>
              )} */}
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
        </tr>
      </tfoot>
    </table>
  );
};

export default EmployeeTable;
