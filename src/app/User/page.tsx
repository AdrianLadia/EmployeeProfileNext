
import React from "react";

import ServerRequests from "@/app/api/ServerRequests";  

import UserTableBody from "./UserTableBody";

import { getUserData, getTestUserData } from "../api/UserData"; 

import {User} from "../schemas/UserSchema";


const page = async () => {
  let userData: User;

  if ( process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV === 'true' ) {
    userData = await getTestUserData();
  } else {
    userData = await getUserData();
  }

  console.log(userData);

  if(!Array.isArray(userData?.roles?.User) || !userData.roles.User.includes('canUpdateUser')){
    return <div>You do not have permission to view this page</div>
  } 
  
  const serverRequests = new ServerRequests();

  const res = await serverRequests.getAllRoles();  

  const userRes = await serverRequests.getAllUsers();   

  return ( 
      <div
        className={`relative h-screen flex flex-col md:justify-center md:items-center px-4 overflow-clip `}
      >
        <div className="h-[10vh] md:hidden " /> 

        <div className="rounded-box h-[80vh] w-full md:w-[80vw] 2xl:w-[70vw] overflow-auto border shadow-2xl backdrop-blur-md " >
          <table className="w-full table h-full ">
            <thead>
              <tr className=" bg-base-300   ">
                <th className=" border p-2 text-[1.02rem] text-center ">Users</th>
                <th className="border p-2 text-[1.02rem] text-start  " colSpan={4}>Roles</th>
              </tr>
              <tr className=" bg-base-200 ">
                <th className="border p-2 ">Name</th>
                {Object.keys(res.data).map((key) => (
                  <th key={key} className="border p-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <UserTableBody userRes={userRes} res={res}/>
            </tbody> 
            <tfoot>
              <tr className=" bg-base-200 ">
                <th className="border p-2">Name</th>
                {Object.keys(res.data).map((key) => (
                  <th key={key} className="border p-2">
                    {key}
                  </th>
                ))}
              </tr> 
              <tr className=" bg-base-300  ">
                <th className=" border p-2 text-[1.02rem] text-center ">Users</th>
                <th className="border p-2 text-[1.02rem] text-start " colSpan={4}>Roles</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="h-[5vh] md:hidden " />
      </div> 
  );
};

export default page;
