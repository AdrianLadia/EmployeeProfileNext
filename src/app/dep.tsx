
import "./globals.css";

import Link from "next/link";

export const metadata = {
  title: '| Home',
  description: 'Page Description',
} 

export default function Home() {  

  const buttonStyle = `btn btn-outline border border-gray-300 join-item md:w-[33%] md:tooltip flex item-center`;

  return (
    <>
      <div 
        className={` h-[95vh] w-full flex flex-col items-center justify-center  `} >  
        <p className=" text-xl md:text-3xl tracking-[0.5rem] md:tracking-[0.8rem] font-semibold mb-8" >Employee Records</p>
        {/* <h1 className='blur-[1px] absolute text-4xl font-semibold tracking-[33px] opacity-80'>Employee  Records</h1> */}

        <div className="join join-vertical md:join-horizontal flex w-[90vw] md:w-[50vw] justify-evenly  ">
          <Link href={"/Offense"} className={`${buttonStyle}`} data-tip={"List/Create/Edit/Delete"}>Offense</Link>
          <Link href={"/Employee"} className={`${buttonStyle}`} data-tip={"Create/Edit/Delete"}>Employee</Link>
          <Link href={"/Memorandum"} className={`${buttonStyle}`} data-tip={"Create/Submit/Delete"}>Memorandum</Link>
        </div>

      </div>  
    </>
  );
}
