'use client'

import React from 'react'

import { useAppContext } from './GlobalContext'

const LoadingOverlay = () => {
    const { userData } = useAppContext() 

  return (
    <div className={`${!userData._id?"  z-40 backdrop-blur-sm opacity-35 skeleton w-screen h-screen cursor-wait ":" -z-10 "} absolute `}> 

    </div>
  )
}

export default LoadingOverlay
