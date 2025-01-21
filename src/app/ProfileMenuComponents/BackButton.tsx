"use client";

import React from "react";

import { useAppContext } from "../GlobalContext";

const BackButton = () => {
  const { router, pathname } = useAppContext();

  const goBack = () => {
    localStorage.setItem("lastPath", "/");
    localStorage.setItem("isBacked", "true");

    router.push(
      lastPath !== "/" && lastPath !== pathname ? lastPath || "" : "/"
    );
  };

  const lastPath = localStorage.getItem("lastPath"); 

  
  React.useEffect(() => {
    const timeout = setTimeout(()=>{
      localStorage.setItem("lastPath", window.location.pathname);
      localStorage.setItem("isBacked", "false");
    }, 200);
    return () => clearTimeout(timeout);
  }, [pathname]);

  const transitionStyle = ` md:duration-100 md:transition-all md:ease-linear`;

  const toDisplay =
    lastPath !== "/" && lastPath !== pathname
      ? lastPath?.substring(1)
      : "Dashboard";

  let backPath; 

  if (toDisplay != "Dashboard") {
    const pathstr = toDisplay?.split("/");
    backPath = `${pathstr?.[1] ? pathstr?.[1]+"-" : ""}${pathstr?.[0]}`;
  } else {
    backPath = toDisplay;
  }


  return (
    <button
      className={` ${pathname === "/" && lastPath === "/" ? "hidden" : ""} z-20
        absolute left-2 top-2 rounded-full flex justify-center items-center overflow-clip  
          p-1 hover:pr-3 hover:text-info-content group `}
      onClick={goBack}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={"size-6 -ml-0.5 stroke-2 z-20 " + transitionStyle}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      <div
        className={
          " z-20 text-xs md:scale-0 md:group-hover:scale-100 md:origin-left " +
          transitionStyle
        }
      >
        {backPath}
      </div>
      <span
        className={
          " z-10 absolute left-0 group-hover:bg-info w-0 group-hover:w-full h-full " +
          transitionStyle
        }
      ></span>
    </button>
  );
};

export default BackButton;
