import React, { useEffect } from "react";

import { useAppContext } from "../GlobalContext";

import { Memo } from "../schemas/MemoSchema";

import Image from "next/image";

const EmployeeMemoTableModal = () => {
  const {
    memoForTableModal,
    setMemoForTableModal,
    handleImageModalClick,
    handleMemoPrintModalClick,
  } = useAppContext();

  const memoTableModalRef = React.useRef<HTMLDialogElement>(null);

  const [isForSingleEmployee, setIsForSingleEmployee] = React.useState(false);

  useEffect(() => {
    if (memoForTableModal.length > 0) {
      const res = memoForTableModal.map((memo) => memo.Employee._id);

      const uniqueArray = [...new Set(res)];

      if (uniqueArray.length > 1) {
        setIsForSingleEmployee(false);
      } else {
        setIsForSingleEmployee(true);
      }
    }
  }, [memoForTableModal]);

  const handleClose = () => {
    setMemoForTableModal([] as Memo[]);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    memoTableModalRef.current?.addEventListener("keydown", handleKeyDown);

    return () => {
      memoTableModalRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <dialog id="EmployeeMemoModal" className="modal " ref={memoTableModalRef}>
      <div className=" bg-transparent shadow-none gap-2 p-0 w-max">
        <div className=" max-h-[80vh] w-[98vw] md:w-[80vw] rounded-box py-8 bg-base-200 px-6 flex justify-center items-center flex-col gap-2 relative ">
          {/*  */}
          <form className="absolute top-2 right-2" method="dialog">
            <button
              onClick={() => handleClose()}
              className=" close-button "
            ></button>
          </form>

          <h3 className="text-xl font-semibold w-full text-start ">
            <span className="text-base">
              {isForSingleEmployee
                ? `Memos ( ${memoForTableModal?.[0]?.Employee?.firstName} ${memoForTableModal?.[0]?.Employee?.lastName} )`
                : `Recent Memos `}
            </span>{" "}
          </h3>
          <div className="w-full h-full overflow-auto rounded-box ">
            <table className="table w-full table-pin-rows ">
              {/* head */}
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th></th>
                  <th className="min-w-[150px]">Date</th>
                  {!isForSingleEmployee && (
                    <th className="min-w-[150px]">Employee</th>
                  )}
                  <th className="min-w-[200px]">Memo</th>
                  <th className="min-w-[20vw]">Offense</th>
                  <th className="min-w-[150px]">Photos</th>
                  <th className="min-w-[150px]">Memo Photos</th>
                  <th className="min-w-[200px]">Reason</th>
                  <th>isSubmitted</th>
                </tr>
              </thead>
              <tbody>
                {memoForTableModal?.map((memo) => (
                  <tr key={memo._id} className="hover:bg-base-100">
                    {/* print */}
                    <td className="w-max text-center ">
                      <button
                        className="hover:text-blue-300 text-info tooltip-right md:tooltip"
                        data-tip="Download"
                        onClick={() => handleMemoPrintModalClick(memo)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                    </td>

                    {/* Date */}
                    <td className="w-max "> {memo?.date?.substring(0, 16)} </td>

                    {/* Employee */}
                    {!isForSingleEmployee && (
                      <td className="w-max font-bold ">
                        {memo?.Employee?.firstName} {memo?.Employee?.lastName}
                      </td>
                    )}

                    {/* Memo */}
                    <td
                      className=" "
                      onClick={() => handleMemoPrintModalClick(memo)}
                    >
                      <h3 className="font-bold underline">{memo?.subject}</h3>
                      <p className="whitespace-pre-line hover:underline decoration-wavy line-clamp-4">
                        {memo?.description}
                      </p>
                    </td>
                    {/* Offense */}
                    <td>
                      <div>
                        <div
                          tabIndex={0}
                          className="collapse collapse-open bg-base-300 w-[70vw] min-[700px]:w-full "
                        >
                          <div className="collapse-title text-base font-bold">
                            {memo?.MemoCode?.title}
                          </div>
                          {/* <summary className="collapse-title text-base font-bold">
                              {memo?.MemoCode?.title}
                            </summary> */}
                          {/* <p className='btn btn-xs text-[.70rem] btn-neutral truncate' >{"remedialAction"}</p> */}
                          <div className="collapse-content flex flex-wrap gap-1 ">
                            <p className="btn btn-xs text-[.70rem] btn-neutral truncate">
                              {memo?.remedialAction || " "}
                            </p>
                            {/* {memo?.remedialAction?.map((action: string, index: number) => (
                                <p className='btn btn-xs text-[.70rem] btn-neutral truncate' key={index}>{action}</p>
                              ))}  */}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Photos */}
                    <td>
                      {" "}
                      <Image
                        className={` w-[150px] h-[150px] ${
                          memo?.mediaList?.[0] && "hover:border"
                        } cursor-pointer `}
                        src={memo?.mediaList?.[0] || ""}
                        width={100}
                        height={100}
                        alt="mediaList"
                        onClick={() =>
                          memo?.mediaList?.[0] &&
                          handleImageModalClick(memo?.mediaList) 
                        }
                      ></Image>{" "}
                    </td>
                    {/* Memo Photos */}
                    <td>
                      {" "}
                      <Image
                        className={` w-[150px] h-[150px] ${
                          memo?.memoPhotosList?.[0] && "hover:border"
                        } cursor-pointer `}
                        src={memo?.memoPhotosList?.[0] || ""}
                        width={100}
                        height={100}
                        alt="memoPhotosList"
                        onClick={() =>
                          memo?.memoPhotosList?.[0] &&
                          handleImageModalClick(memo?.memoPhotosList)
                        }
                      ></Image>{" "}
                    </td>
                    {/* Reason */}
                    <td>
                      {" "}
                      <p
                        onClick={() => handleMemoPrintModalClick(memo)}
                        className="whitespace-pre-line hover:underline decoration-wavy line-clamp-4"
                      >
                        {memo?.reason || "None"}
                      </p>{" "}
                    </td>
                    {/* isSubmitted */}
                    <td className="font-bold text-center text-xl">
                      {memo?.submitted ? (
                        <span className="text-success">✔</span>
                      ) : (
                        <span className="text-error">X</span>
                      )}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* foot */}
              <tfoot>
                <tr className="bg-gray-500 text-white">
                  <th></th>
                  <th>Date</th>
                  {!isForSingleEmployee && (
                    <th className="min-w-[150px]">Employee</th>
                  )}
                  <th>Memo</th>
                  <th>Offense</th>
                  <th>Photos</th>
                  <th>Memo Photos</th>
                  <th>Reason</th>
                  <th>isSubmitted</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default EmployeeMemoTableModal;
