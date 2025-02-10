import React from "react";

import DeleteOffenseForm from "./DeleteOffenseForm";

import { Offense } from "@/app/schemas/OffenseSchema";

import ServerRequests from "@/app/api/ServerRequests";

const DeleteOffenseModal = async () => {
  const serverRequests = new ServerRequests();

  const res = await serverRequests.fetchOffenseList();

  const offenseList: Offense[] = res.data; 

  return (
    <dialog id="deleteOffenseModal" className="modal w-screen h-screen ">
      <div className={` form-container relative`}>
        <form className="absolute top-2 right-2" method="dialog">
          <button className="close-button"></button>
        </form>
        <DeleteOffenseForm confirmation={false} offenseList={offenseList} />
      </div>
    </dialog>
  );
};

export default DeleteOffenseModal;
