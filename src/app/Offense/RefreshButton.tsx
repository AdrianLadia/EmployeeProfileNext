"use client";

import React from "react";

// import Link from "next/link";

interface RefreshButtonProps {
  href?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ href = "/Offense" }) => {
  return (
    <a
      className="btn bg-warning hover:bg-warning text-white grid place-content-center
           btn-sm md:tooltip tooltip-left md:tooltip-top tooltip-top tooltip-warning"
      data-tip="Refresh"
      href={href}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </a>
  );
};

export default RefreshButton;
