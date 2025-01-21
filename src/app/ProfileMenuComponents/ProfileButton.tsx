import React, { FC } from 'react'  

import { User } from '../schemas/UserSchema';

import Image from 'next/image'
export interface ProfileButtonProps {
    userData: User,
    handleMenuClick: () => void;
    showMenu: boolean 
}

const ProfileButton: FC<ProfileButtonProps> = ({ userData, handleMenuClick, showMenu }) => { 
  
  return (
    <div 
        className={` 
          z-[60] cursor-pointer w-full h-full ${!showMenu && " tooltip-left  tooltip "} 
      `}
        onClick={()=>handleMenuClick()}
        data-tip="Profile"
        id='profile-button'
    >
      <Image 
        fill={true}
        className={` border-4
          ${showMenu && " border-info"} 
          w-full h-full duration-300 shadow-xl rounded-full  
        `} 
          src={userData?.image} alt={userData?.displayName} 
        />
    </div>
  )
}

export default ProfileButton
