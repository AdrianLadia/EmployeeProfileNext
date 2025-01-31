import React from "react";

import ServerRequests from "@/app/api/ServerRequests";

import { Offense } from "@/app/schemas/OffenseSchema"; 

import OffenseMenu from "./OffenseMenu.tsx";

import CreateOffenseModal from "./Create/CreateOffenseModal"; 
import DeleteOffenseModal from "./Delete/DeleteOffenseModal";
import UpdateOffenseModal from "./Update/UpdateOffenseModal";  


import OffenseTable from "./OffenseTable";

import SearchBar from "../Dashboard/SearchBar";



const page = async () => {
  
  const serverRequests = new ServerRequests();

  const res = await serverRequests.fetchOffenseList();

  let offenseList: Offense[] = res.data || []; 

  offenseList = offenseList.sort((a, b) => a.number - b.number);

  return (
    <>
      <CreateOffenseModal />
      <UpdateOffenseModal />
      <DeleteOffenseModal /> 
        
      <div
        className={`relative h-screen flex flex-col justify-center items-center px-2 overflow-clip `}
      >
        <div className="h-[10vh] md:hidden " /> 

        {/* action buttons */}
        <div className="w-full md:w-[80vw] 2xl:w-[70vw] flex flex-col md:flex-row justify-between bg-base-200 rounded-t-box px-2 border border-b-none"> 

          <OffenseMenu
            offenseList={offenseList}
          />
          
          <div className="py-2 ">
            <SearchBar></SearchBar>
          </div>
        </div>

        <div className=" rounded-box rounded-t-none h-[75vh] w-full md:w-[80vw] 2xl:w-[70vw] overflow-auto border shadow-2xl backdrop-blur-md border-t-none" >
          <OffenseTable offenseList={offenseList}/>
        </div>
        <div className="h-[5vh] md:hidden " />
      </div>
    </>
  );
};

export default page;
