import React from "react";

import DeleteMemoForm from "./DeleteMemoForm";

import { Memo } from "@/app/schemas/MemoSchema";

import ServerRequests from "@/app/api/ServerRequests";

export const metadata = {
  title: "| Delete Memorandum",
  description: "Delete Memo Form",
};

const page = async () => {
  const serverRequests = new ServerRequests();

  const [memoRes] = await Promise.all([
    serverRequests.getAllMemoThatsNotSubmitted(),
  ]);

  const memoList: Memo[] = memoRes?.data || [];

  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      {/* DeleteMemoForm container */}
      <div className={` form-container `}>
        <DeleteMemoForm memoList={memoList} />
      </div>
    </div>
  );
};

export default page;
