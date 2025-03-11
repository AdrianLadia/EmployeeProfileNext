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
    handleVideoModalClick,
  } = useAppContext();

  const memoTableModalRef = React.useRef<HTMLDialogElement>(null);

  const [isForSingleEmployee, setIsForSingleEmployee] = React.useState(false);

  const [sortedMemos, setSortedMemos] =
    React.useState<Memo[]>(memoForTableModal);

  useEffect(() => {
    if (memoForTableModal.length > 0) {
      const res = memoForTableModal.map((memo) => memo?.Employee?._id);

      const uniqueArray = [...new Set(res)];

      if (uniqueArray.length > 1) {
        setIsForSingleEmployee(false);
      } else {
        setIsForSingleEmployee(true);
      }

      const sorted = memoForTableModal.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setSortedMemos(sorted);
    }
  }, [memoForTableModal]);

  const handleClose = () => {
    setMemoForTableModal([] as Memo[]);
  };

  return (
    <dialog
      id="EmployeeMemoModal"
      className="modal outline-none"
      ref={memoTableModalRef}
    >
      <div className=" bg-transparent shadow-none gap-2 p-0 w-max">
        <div className="h-[100svh] w-[98vw] rounded-box py-8 backdrop-blur-sm md:px-6 flex justify-center items-center flex-col gap-2 relative ">
          {/*  */}
          <form
            className="absolute top-2 flex justify-between w-full pl-2 pr-1 md:pl-6 "
            method="dialog"
          >
            <h3 className=" font-semibold w-max text-start backdrop-blur-2xl p-2 ">
              <span className=" text-white text-base ">
                {isForSingleEmployee
                  ? `Memos ( ${memoForTableModal?.[0]?.Employee?.firstName} ${memoForTableModal?.[0]?.Employee?.lastName} )`
                  : `Recent Memos `}
              </span>{" "}
            </h3>

            <button
              onClick={() => handleClose()}
              className=" close-button p-0"
            ></button>
          </form>

          <div className="w-full max-h-[90%] overflow-auto rounded-box  ">
            <table className="table w-full table-pin-rows ">
              {/* head */}
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th></th>
                  <th className="min-w-[150px]">Date</th>
                  {!isForSingleEmployee && (
                    <th className="min-w-[150px]">Employee</th>
                  )}
                  <th className="min-w-[300px]">Memo</th>
                  {/* <th className="min-w-[20vw]">Offense</th> */}
                  <th className="min-w-[125px]">Media</th>
                  <th className="min-w-[125px]">Memo Photo</th>
                  <th>Reason</th>
                  <th>isSubmitted</th>
                </tr>
              </thead>
              <tbody>
                {sortedMemos?.map((memo) => (
                  <tr
                    key={memo._id}
                    className={`${
                      !memo?.submitted ? "bg-red-50/70" : "bg-base-100/80"
                    } `}
                  >
                    {/* print */}
                    <td className="w-max text-center ">
                      <button
                        className="hover:text-blue-300 text-info"
                        title="Download"
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
                    <td className="w-max "> {memo?.date?.substring(0, 10)} </td>

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
                      <div className="p-4 bg-base-200 hover:bg-base-100 cursor-pointer rounded-box">
                        <h2 className="font-bold text-base text-pretty" title="Title">
                          {memo?.MemoCode?.title}
                        </h2>
                        <div className="w-full my-0.5" />
                        {/* <h3 className="indent-1 text-sm font-bold -mb-0.5" title="Subject">
                          {memo?.subject}
                        </h3> */}
                        <p className="text-xs px-1 whitespace-pre-line line-clamp-3" title="Message">
                          {memo?.description}
                        </p>
                        <div className="w-full my-1" />
                        <p className="btn btn-xs text-[.70rem] btn-neutral truncate mt-1">
                          {memo?.remedialAction || "No Offense"}
                        </p>
                      </div>
                    </td>
                    {/* Offense */}
                    {/* <td>
                      <div>
                        <div
                          tabIndex={0}
                          className="collapse collapse-open bg-base-300/90 w-[70vw] min-[700px]:w-full "
                        >
                          <div className="collapse-title text-base font-bold">
                            {memo?.MemoCode?.title}
                          </div> 
                          <div
                            className={` collapse-content flex flex-wrap gap-1 `}
                          >
                            <p className="btn btn-xs text-[.70rem] btn-neutral truncate">
                              {memo?.remedialAction || "No Offense"}
                            </p> 
                          </div>
                        </div>
                      </div>
                    </td> */}
                    {/* Photos */}
                    <td>
                      <div className="overflow-clip w-[125px] h-[125px] border cursor-pointer border-neutral text-neutral-content group flex justify-center items-center rounded-box">
                        {memo?.mediaList?.[0]
                          ?.toLocaleLowerCase()
                          .includes("video") ? (
                          <div
                            className={` indent-0.5 text-4xl group-hover:text-3xl w-full h-full flex justify-center items-center bg-neutral group-hover:bg-neutral/50  `}
                            onClick={() =>
                              handleVideoModalClick(memo?.mediaList?.[0] || "")
                            }
                            title="Play Video"
                          >
                            ▶
                          </div>
                        ) : memo?.mediaList?.[0] ? (
                          <Image
                            className={` w-full h-full hover:p-1 `}
                            src={memo?.mediaList?.[0] || ""}
                            width={100}
                            height={100}
                            alt="mediaList"
                            onClick={() =>
                              memo?.mediaList?.[0] &&
                              handleImageModalClick(memo?.mediaList)
                            }
                          />
                        ) : (
                          <span className="text-neutral">X</span>
                        )}
                      </div>
                    </td>
                    {/* Memo Photos */}
                    <td>
                      <div className="w-[125px] h-[125px] border border-neutral group rounded-box overflow-clip flex items-center justify-center">
                        {memo?.memoPhotosList?.[0] ? (
                          <Image
                            className={` w-full h-full hover:p-1 `}
                            src={memo?.memoPhotosList?.[0] || ""}
                            width={100}
                            height={100}
                            alt="memoPhotosList"
                            onClick={() =>
                              memo?.memoPhotosList?.[0] &&
                              handleImageModalClick(memo?.memoPhotosList)
                            }
                          />
                        ) : (
                          <span className="text-neutral">X</span>
                        )}
                      </div>
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
                        <div className="flex gap-2 ">
                          <a
                            href={"/Memo/Delete" + `#${memo?._id}`}
                            className="btn btn-sm btn-error btn-outline"
                          >
                            Delete
                          </a>
                          <a
                            href={"/Memo/Submit" + `#${memo?._id}`}
                            className="btn btn-sm btn-info"
                          >
                            Submit
                          </a>
                        </div>
                      )}
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
                  {/* <th>Offense</th> */}
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
