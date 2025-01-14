'use client';
import React from "react";

import Offenses from "./EmployeeManagementBackup.Offense.json"

import { useAppContext } from "./GlobalContext";

import { Offense } from "./schemas/OffenseSchema";

const UploadOffenseButton = () => {

    const {serverRequests, userData} = useAppContext()

    const stringOffense = JSON.stringify(Offenses)

    const offenseList = JSON.parse(stringOffense)

    const onUpload = async () => { 
        offenseList.forEach(async (offense: Offense, index: number) => {
            const response = await serverRequests.createOffense(offense, userData)
            console.log(response)
            console.log(index)
        })
    }

  return (
    <button className="absolute top-1/2 bottom-1/2 z-50 btn right-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-max btn-primary "
        onClick={() => {
            onUpload()
        }}
    >
      Upload
    </button>
  );
};

export default UploadOffenseButton;
