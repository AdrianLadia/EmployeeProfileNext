"use client";

import React from "react";

import CreateButton from "./CreateButton";
import UpdateButton from "./UpdateButton";
import DeleteButton from "./DeleteButton";
import OffenseDownloadButton from "./OffenseDownloadButton";
import RefreshButton from "./RefreshButton";

const OffenseMenu = () => {
  const [showMenu, setShowMenu] = React.useState(true);

  return (
    <div className={` flex gap-2 w-full h-12 justify-center md:justify-start `}>
      <div className="h-full items-center flex">
        <input
          className="radio radio-xl rounded-box "
          checked={showMenu}
          onChange={(e) => setShowMenu(e.target.checked)}
          type="checkbox"
          name="showMenu"
          id="showMenu"
        />
      </div>

      <div
        className={`${
          !showMenu && " hidden " 
        } flex gap-2 items-center justify-start pl-2 `}
      >
        <CreateButton />
        <UpdateButton />
        <DeleteButton />
        <OffenseDownloadButton />
        <RefreshButton />
      </div>
    </div>
    // <div className=" swap flex gap-3 items-center justify-start pl-2 ">
    //         <input
    //           type="checkbox"
    //           defaultChecked
    //           id="" className=" radio radio-xl rounded "
    //         />
    //         <div className=" swap-on flex justify-evenly md:justify-start items-center gap-4 px-2 py-2 rounded-box ">
    //           <CreateButton />
    //           <UpdateButton />
    //           <DeleteButton />
    //           <OffenseDownloadButton />
    //           <RefreshButton  />
    //         </div>
    //       </div>
  );
};

export default OffenseMenu;
