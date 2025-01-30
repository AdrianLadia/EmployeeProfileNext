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

  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close modal on outside click
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) { 
        setShowMenu(false) 
      }
    };

    if (showMenu) {
      window.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [showMenu]);

  React.useEffect(()=>{  
    if(window.innerWidth<1536){
      setShowMenu(false)
    }
  },[pathname])

  return (
    <div 
      className={` ${pathname == "/Dashboard"&&"hidden"}
        fixed top-2 right-2 md:top-4 md:right-4 h-14 md:h-16 w-14 md:w-16 duration-300 z-50
      `} 
      onClick={()=>setShowMenu(false)}
    >   
      {userData?._id ?
        <div className='w-full h-full' onClick={(e) => e.stopPropagation()} ref={modalRef}>
          <ProfileButton userData={userData} handleMenuClick={handleMenuClick} showMenu={showMenu}/>
          <ProfilePopUp userData={userData} showMenu={showMenu} cards={cards} pathname={pathname}/>
        </div>
        :
        <ProfileMenuSkeleton/> 
      }
        
    </div>
  )
}

export default ProfileMenu
