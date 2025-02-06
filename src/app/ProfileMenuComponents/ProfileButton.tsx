import React, { FC } from "react";

import { User } from "../schemas/UserSchema";

import Image from "next/image";
export interface ProfileButtonProps {
  userData: User;
  handleMenuClick: () => void;
  showMenu: boolean;
}

const ProfileButton: FC<ProfileButtonProps> = ({
  userData,
  handleMenuClick,
  showMenu,
}) => {
  return (
    <div
      className={` 
          z-[60] cursor-pointer w-full h-full ${
            !showMenu && " md:tooltip-left  md:tooltip relative"
          } 
      `}
      onClick={(e) => {
        handleMenuClick();
        e.stopPropagation();
      }}
      data-tip="Profile"
      id="profile-button"
    >
      <div
        hidden={!showMenu}
        className="z-10 right-[.70rem] md:right-[.89rem] -bottom-[1.35rem] absolute w-0 h-0 
      border-l-[16px] border-r-[16px] border-b-[20.5px] border-transparent border-b-info border-opacity-60"
      />
      <Image
        fill={true}
        className={` border-4
          ${showMenu && " border-info"} 
          w-full h-full duration-300 shadow-xl rounded-full  
        `}
        src={userData?.image}
        alt={userData?.displayName}
      />
    </div>
  );
};

export default ProfileButton;
