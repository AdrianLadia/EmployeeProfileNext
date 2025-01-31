"use client";

import React from "react";

import Link from "next/link";

import { useAppContext } from "../GlobalContext";

interface BreadcrumbsProps {
  pathName?: string;
  fixed?: boolean;
  position?: { x: string; y: string };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  pathName,
  fixed,
  position = { x: "", y: "" },
}) => {
  const { pathname, loading } = useAppContext();

  const [pathArray, setPathArray] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    if (pathName) {
      setPathArray(pathName.split("/").filter((path) => path !== ""));
    } else {
      setPathArray(pathname.split("/").filter((path) => path));
    }
  }, [pathName, pathname]);

  if (fixed && position?.x === "" && position?.y === "") {
    throw new Error("Position prop is required when fixed is true");
  }

  const xpaths = ["/Offense"];

  if (xpaths.includes(pathname)) {
    return null;
  }

  return (
    pathArray && (
      <div
        className={`
        ${fixed && `${position.x} ${position.y} fixed z-30`} 
        breadcrumbs text-sm 
        flex md:flex-col 2xl:flex-row items-center md:items-start 2xl:items-center overflow-hidden
      `}
      >
        <ul className="flex !justify-start !items-start text-start md:!flex-col 2xl:!flex-row relative ">
          <li>
             
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
              />
            </svg>
              
            <Link className="hover:text-info" href="/" id="Dashboard">
              Dashboard
            </Link>
          </li>
          
          {pathArray?.map((path, index) => {
            const href = "/" + pathArray.slice(0, index + 1).join("/");
            const isLast = index === pathArray.length - 1;

            return (
              <li key={index}>
                {!isLast ? (
                  <Link className=" hover:text-info " href={href}>
                    {path.replace(/-/g, " ")}
                  </Link>
                ) : (
                  <span>{path.replace(/-/g, " ")}</span>
                )}
              </li>
            );
          })}
        </ul>

        <a
          href={window.location.origin + pathname}
          className="text-xs flex md:mt-1 2xl:mt-0 tooltip tooltip-right"
          title="Refresh"
          data-tip="Refresh"
        >
          <span className=" md:hidden 2xl:block">       </span>
          <span className=" 2xl:hidden"> </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`${
              loading ? "animate-spin" : "hover:rotate-45 "
            } text-info size-[1.2rem] duration-200 `}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </a>
      </div>
    )
  );
};

export default Breadcrumbs;
