'use client' 

import React from 'react'  

import { useAppContext } from '@/app/GlobalContext'; 

const BackButton = () => {

  const { router } = useAppContext(); 

  return ( 
    <button 
      onClick={() =>  
        router.push('/')
      }
        className=' 
          fixed top-2 left-2 md:top-4 md:left-4 h-12 w-12 text-xl border md:tooltip tooltip-right
          bg-base-200/80 hover:border-info hover:text-info z-40
          shadow-sm shadow-gray-600 p-4 rounded-box flex items-center justify-normal 
        '
        data-tip="Home"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
      </svg>  
  </button>
  )
}

export default BackButton
