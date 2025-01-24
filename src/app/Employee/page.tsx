import React from "react";

import Link from "next/link";

export const metadata = {
  title: "| Employee",
  description: "Employee page",
};

const page = () => {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-clip">
      <h1 className="blur-[3px] absolute text-3xl md:text-6xl lg:text-8xl font-semibold mb-6 tracking-[15px] md:tracking-[35px] lg:tracking-[55px] opacity-80">
        Employee
      </h1>

      <div className="flex flex-col md:flex-row-reverse md:flex-wrap gap-6 w-full h-[80%] md:h-max justify-evenly items-center overflow-auto py-8 px-4">
        <div className="card card-compact w-[280px] shadow-xl backdrop-blur-sm bg-base-100/30 overflow-clip">
          <figure className="bg-blue-500/70 py-10 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Create</h2>
            <p>Register an Employee!</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Employee/Create"}
                className="mt-2 btn btn-sm btn-outline btn-info group"
              >
                <span className="group-hover:text-white">Create </span>Now
              </Link>
            </div>
          </div>
        </div>
        <div className="card card-compact w-[280px] shadow-xl backdrop-blur-sm bg-base-100/30 overflow-clip">
          <figure className="bg-violet-500/70 py-10 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-20"
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
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Update</h2>
            <p>Update Employee Details!</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Employee/Update"}
                className="mt-2 btn btn-sm btn-outline hover:bg-violet-500 border-violet-500 text-violet-500 group "
              >
                <span className="group-hover:text-white">Update </span>
                <span className=" group-hover:invert">Now</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="card card-compact w-[280px] shadow-xl backdrop-blur-sm bg-base-100/30 overflow-clip">
          <figure className="bg-red-500/70 py-10 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Delete</h2>
            <p>Delete an Employee!</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Employee/Delete"}
                className="mt-2 btn btn-sm btn-outline btn-error group"
              >
                <span className="group-hover:text-white">Delete </span>Now
              </Link>
            </div>
          </div>
        </div>
        <div className="card card-compact w-[280px] shadow-xl backdrop-blur-sm bg-base-100/30 overflow-clip">
          <figure className="bg-accent/70 py-10 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.3}
              stroke="currentColor"
              className="size-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Generate</h2>
            <p>Generate ID</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Employee/GenerateID"}
                className="mt-2 btn btn-sm btn-outline btn-accent group"
              >
                <span className="group-hover:invert">Generate </span>Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
