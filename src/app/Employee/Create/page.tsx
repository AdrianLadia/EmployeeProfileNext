import React from "react";

import CreateEmployeeForm from "./CreateEmployeeForm";

export const metadata = {
  title: "| Create Employee",
  description: "Employee Creation Form",
};

const page = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center relative ">
      {/* CreateEmployeeForm container */}
      <div className={` form-container `}>
        <CreateEmployeeForm />
      </div>
    </div>
  );
};

export default page;
