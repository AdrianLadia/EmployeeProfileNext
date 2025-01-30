import React from "react";

import Link from "next/link";

export const metadata = {
  title: "| Memorandum",
  description: "Memorandum page",
};

const page = () => {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-clip">
      <h1 className="blur-[3px] absolute text-3xl md:text-6xl lg:text-8xl font-semibold mb-6 tracking-[10px] md:tracking-[25px] lg:tracking-[35px] opacity-80">
        Memorandum
      </h1>

      <div className="flex flex-col md:flex-row-reverse md:flex-wrap gap-6 w-full h-[80%] md:h-max justify-evenly items-center overflow-auto py-8 px-4">
        <div className="card card-compact w-[280px] shadow-xl backdrop-blur-sm bg-base-100/30 overflow-clip">
          <figure className="bg-blue-500/70 py-10 text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Create</h2>
            <p>Create Memorandum</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Memo/Create"}
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
                d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Submit</h2>
            <p>Submit Memorandum</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Memo/Submit"}
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
                d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </figure>
          <div className="card-body bg-base/70">
            <h2 className="card-title">Delete</h2>
            <p>Delete Memorandum</p>
            <div className="card-actions justify-end">
              <Link
                href={"/Memo/Delete"}
                className="mt-2 btn btn-sm btn-outline btn-error group"
              >
                <span className="group-hover:text-white">Delete </span>Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
