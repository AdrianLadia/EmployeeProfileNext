"use client";

import React from "react";

const CreateButton = () => {

  const handleClick = () => {
    const modal = document.getElementById("createOffenseModal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  return (
    <button
      className="btn btn-success btn-sm md:tooltip tooltip-left md:tooltip-top tooltip-success text-white"
      onClick={handleClick}
      data-tip="Create Offense"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg> 
    </button>
  );
};

export default CreateButton;
