"use client";

import React from "react";

import { useAppContext } from "../GlobalContext";

import { Offense } from "../schemas/OffenseSchema";

const OffenseDownloadButton: React.FC<{ offenseList: Offense[] }> = ({ offenseList }) => {
  const { handleOffenseListClick } = useAppContext();

  const handleClick = () => { 
    handleOffenseListClick(offenseList);
  };

  return (
    <button
      className="btn btn-accent btn-sm tooltip tooltip-left text-white md:tooltip-top tooltip-accent"
      onClick={handleClick}
      data-tip="Download"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </button>
  );
};

export default OffenseDownloadButton;
