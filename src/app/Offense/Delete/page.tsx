import React from 'react'

import DeleteOffenseForm from './DeleteOffenseForm'

import { Offense } from '@/app/schemas/OffenseSchema';

import ServerRequests from '@/app/api/ServerRequests';

export const metadata = {
  title: '| Delete Offense',
  description: 'Delete Offense Form',
} 

const page = async () => {

  const serverRequests = new ServerRequests( ); 
  
  const res = await serverRequests.fetchOffenseList();

  if(!res?.data){
    return <div> No Data Found </div>
  }

  const offenseList: Offense[] = res.data;  

  const remedialActions = [
    "Written-Reprimand",
    "Verbal Reprimand",
    "Verbal And Written Reprimand",
    "1 Day Suspension",
    "3 Days Suspension",
    "5 Days Suspension",
    "7 Days Suspension",
    "15 Days Suspension",
    "30 Days Suspension",
    "15 Days Suspension Or Management Discretion",
    "Dismissal",
    "Dismissal based on Offense Severity", 
    "Written Reprimand / Suspension / Dismissal",
    "3 Days Suspension + 7 Days Gadget Confiscation",
    "7 Days Suspension + 15 Days Gadget Confiscation",
    "15 Days Suspension + 30 Days Gadget Confiscation",
  ];

  return (
    <div className='w-screen h-screen flex items-center justify-center '>  
      <div className={` form-container `} >
        <DeleteOffenseForm offenseList={offenseList} remedialActions={remedialActions}/>
      </div> 
    </div>
  )
}

export default page
