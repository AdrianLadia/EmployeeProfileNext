'use client';
import React from 'react'

import { useAppContext } from './GlobalContext'; 

const Confirmation = () => {

    const { confirmationOptions, setConfirmationOptions } = useAppContext();    

    if(!confirmationOptions.open) return null;

    const clearedOptions = {open: false,  question: '', consequence: "", type: '', onConfirm: () => {}, onCancel: () => {}};

    const handleConfirm = () => {
        confirmationOptions.onConfirm();
        setConfirmationOptions(clearedOptions);
    }

    const handleCancel = () => {
        confirmationOptions.onCancel(); 
        setConfirmationOptions(clearedOptions);
    }  

  return (
    <form 
        className={` ${confirmationOptions.open ? ' fixed !z-[9999] ' : ' hidden '}
            w-[99vw] h-[99vh] z-[999] top-[0%] left-1/2 right-1/2 translate-x-[-50%]  
            flex justify-center items-center backdrop-blur-sm bg-inherit alert
        `}
        role="alert" 
    > 
        <div 
            className={`${confirmationOptions.open ? ' scale-100 ' : ' scale-0 '}
            gap-5 w-max rounded-box shadow-2xl !z-[9999]
            flex flex-col justify-center items-center overflow-clip bg-base-100
        `}
        > 
            <span 
                className={`text-${confirmationOptions.type} flex gap-2 justify-start text-start w-full font-bold text-xl px-10 border-b pt-8 pb-6 `}
            >{confirmationOptions?.question}</span>

            <span className='text-start px-10 py-4'>{confirmationOptions?.consequence}</span>

            <div className='flex flex-col md:flex-row-reverse gap-2 justify-evenly w-full pt-4 pb-6 px-2'>
                <button className={`btn bg-${confirmationOptions.type} `} type='button' id='confirm-button' autoFocus onClick={handleConfirm}>Confirm</button>
                <button className={`btn btn-ghost`} id='cancel-button' type='button' onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    </form>
  )
}

export default Confirmation
