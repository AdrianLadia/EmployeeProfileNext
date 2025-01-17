import React from "react";

import ServerRequests from "@/app/api/ServerRequests";

import { Offense } from "@/app/schemas/OffenseSchema";

import CreateButton from "./CreateButton"; 
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";
import OffenseDownloadButton from "./OffenseDownloadButton";
import RefreshButton from "./RefreshButton";

import CreateOffenseModal from "./Create/CreateOffenseModal"; 
import DeleteOffenseModal from "./Delete/DeleteOffenseModal";
import UpdateOffenseModal from "./Update/UpdateOffenseModal";  
import OffenseTableModal from "./OffenseTableModal";

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
      <OffenseTableModal offenseList={offenseList}/>
        
      <div
        className={`relative h-screen flex flex-col justify-center items-center px-2 overflow-clip `}
      >
        <div className="h-[10vh] md:hidden " /> 

        {/* action buttons */}
        <div className="w-full md:w-[80vw] 2xl:w-[70vw] flex flex-col md:flex-row justify-between bg-base-200 rounded-t-box px-2 border border-b-none">
          {/* <div className="flex justify-evenly md:justify-start items-center gap-4 px-2 py-2 rounded-box"> */}
          <div className=" swap flex gap-3 items-center justify-start pl-2 max-w-full md:max-w-[50vw] overflow-x-auto">
            <input 
              type="checkbox" 
              defaultChecked 
              id="" className=" radio radio-xl rounded "  
            />
            <div className=" swap-on flex justify-evenly md:justify-start items-center gap-4 px-2 py-2 rounded-box ">
              <CreateButton />
              <UpdateButton />
              <DeleteButton /> 
              <OffenseDownloadButton />
              <RefreshButton  />
            </div>
          </div>
          {/* </div> */}
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
