import React from "react";

import Link from "next/link";

type Props = {
  employeeResponse: { error: string };
};

const NotAuthorized = (props: Props) => {
  const employeeResponse = props.employeeResponse;

  return (
    <div
      className={` ${
        employeeResponse.error
          ? "scale-100 flex items-start justify-center w-full h-full p-5 absolute z-50 backdrop-blur-sm "
          : " "
      } `}
    >
      <div
        role="alert"
        className="alert alert-error text-white rounded-box alert-opacity-90 w-[80%] md:w-[60%]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className=" h-6 w-6 shrink-0 stroke-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="text-lg">{employeeResponse.error}</span>
        <div className="flex flex-col md:flex-row md:tooltip" data-tip="Home">
          <Link href={"/"} className="btn btn-sm btn-neutral ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
