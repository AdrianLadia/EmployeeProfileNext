import React from "react";

import SubmitMemoForm from "./SubmitMemoForm";

import { Memo } from "@/app/schemas/MemoSchema";

import ServerRequests from "@/app/api/ServerRequests";

export const metadata = {
  title: "| Submit Memorandum",
  description: "Submit Memo Form",
};

const page = async () => {
  const serverRequests = new ServerRequests();

  const [memoRes] = await Promise.all([
    serverRequests.getAllMemoThatsNotSubmitted(),
  ]);

  const memoList: Memo[] = memoRes?.data || [];

  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      {/* CreateMemoForm container */}
      <div className={` form-container `}>
        <SubmitMemoForm memoList={memoList} />
      </div>
    </div>
  );
};

export default page;
