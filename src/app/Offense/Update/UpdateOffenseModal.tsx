import React from "react";

import UpdateOffenseForm from "./UpdateOffenseForm";

import { Offense } from "@/app/schemas/OffenseSchema";

import ServerRequests from "@/app/api/ServerRequests";

const UpdateOffenseModal = async () => {
  const serverRequests = new ServerRequests();

  const res = await serverRequests.fetchOffenseList();

  const offenseList: Offense[] = res.data;

  return (
    <dialog id="updateOffenseModal" className="modal w-screen h-screen ">
      <div className={` form-container relative`}>
        <form className="absolute top-2 right-2" method="dialog">
          <button className="close-button"></button>
        </form>
        <UpdateOffenseForm confirmation={false} offenseList={offenseList} />
      </div>
    </dialog>
  );
};

export default UpdateOffenseModal;
