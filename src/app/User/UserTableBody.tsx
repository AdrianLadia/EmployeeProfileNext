"use client";

import React from "react";

import { User } from "@/app/schemas/UserSchema";

import Image from "next/image";

import { useAppContext } from "../GlobalContext";

interface UserTableBodyProps {
  userRes: { data: User[]; message: string };
  res: { data: { [k: string]: unknown }; message: string };
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ userRes, res }) => {
  const { userData, serverRequests, router, handleConfirmation, setToastOptions } = useAppContext();

  const handleRoleClick = async (
    user: User,
    category: string,
    roleToAdd: string,
    checked: boolean
  ) => {
    const confirmed = await handleConfirmation(`Confirm Action?`, `${checked ? "Remove" : "Add"} ${roleToAdd} to ${user.displayName}?`, `${checked ? "error" : "success"}`);

    if(confirmed){
      try{
        let res;
        if (!checked) {
          res = await serverRequests.addRoleToUser(
            userData,
            user,
            category,
            roleToAdd
          );
          router.refresh(); 
        } else {
          res = await serverRequests.removeRolefromUser(
            userData,
            user,
            category,
            roleToAdd
          );
          router.refresh();
        } 
        setToastOptions({open: true, message: res?.message, type: "success", timer: 5})
      }catch (e) {
        console.error(e)
        setToastOptions({open: true, message: (e as Error).message, type: "error", timer: 5})
      }
    }
  };

  const checkRole = (
    roles: string[],
    userRoles: string[],
    category: string,
    user: User
  ) => {
    return Object.keys(userRoles).map((key) => (
      <div className="flex gap-2 my-2" key={key + user.displayName}>
        <input
          onChange={() =>
            handleRoleClick(user, category, key, roles.includes(key))
          }
          className="checkbox checkbox-sm"
          type="checkbox"
          name={key + user.displayName}
          id={key + user.displayName}
          checked={roles.includes(key)}
        />
        <label htmlFor={key + user.displayName}>{key}</label>
      </div>
    ));
  };

  return (
    <>
      {userRes.data.map((user: User, idx: number) => (
        <tr key={user._id || "" + idx} className="border-b">
          {/* <td className="border p-2">{user.displayName}</td> */}
          <td className=" bg-base-200 bg-opacity-90 border-b"> 
            <div className="flex justify-start items-start gap-3">
              <div className="flex gap-2 items-center justify-center">
                <div className="mask mask-squircle h-12 w-12 ">
                  {user?.image ? (
                    <Image
                      src={user?.image || ""}
                      loading="lazy"
                      alt={user?.displayName}
                      height={100}
                      width={100}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-base-200 grid place-items-center">
                      {" "}
                      ?{" "}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-start">
                <div className="text-sm opacity-80 tracking-tighter">
                <div className="font-bold text-lg">{user?.displayName}</div>
                  {user.email ? user.email.toString() : ""}
                </div>
              </div>
            </div>
          </td>
          {Object?.keys(res?.data || {}).map((key: string) => (
            <td key={key} className={"border px-4" }>
              {checkRole(
                user.roles[key] as string[],
                res.data[key] as string[],
                key,
                user
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default UserTableBody;
