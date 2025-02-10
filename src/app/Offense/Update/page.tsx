import React from 'react'

import UpdateOffenseForm from './UpdateOffenseForm'

import { Offense } from '@/app/schemas/OffenseSchema';

import ServerRequests from '@/app/api/ServerRequests';

export const metadata = {
  title: '| Update Offense',
  description: 'Update Offense Form',
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
      {/* UpdateOffenseForm container */}
      <div className={` form-container `} >
        <UpdateOffenseForm offenseList={offenseList} />
      </div>


    </div>
  )
}

export default page
