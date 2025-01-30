'use client';

import React, { useState } from 'react';

import { useAppContext } from '../GlobalContext';  

import ProfileButton from './ProfileButton';
import ProfilePopUp from './ProfilePopUp';
import ProfileMenuSkeleton from './ProfileMenuSkeleton';

const ProfileMenu = () => {

  const { userData, pathname, cards } = useAppContext(); 

  const [ showMenu, setShowMenu ] = useState(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  }  
  
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { 
        setShowMenu(false); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); 

  React.useEffect(()=>{  
    setShowMenu(false) 
  },[pathname])

  return (
    <div 
      className={` ${pathname == "/Dashboard"&&"hidden"}
        fixed top-2 right-2 md:top-4 md:right-4 h-14 md:h-16 w-14 md:w-16 duration-300 z-50
      `} 
    >   
      {userData?._id ?
        <>
          <ProfileButton userData={userData} handleMenuClick={handleMenuClick} showMenu={showMenu}/>
          <ProfilePopUp userData={userData} showMenu={showMenu} cards={cards} pathname={pathname}/>
        </>
        :
        <ProfileMenuSkeleton/> 
      }
        
    </div>
  )
}

export default ProfileMenu
