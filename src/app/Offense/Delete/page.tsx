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
 
  return (
    <div className='w-screen h-screen flex items-center justify-center '>  
      <div className={` form-container `} >
        <DeleteOffenseForm offenseList={offenseList} />
      </div> 
    </div>
  )
}

export default page
