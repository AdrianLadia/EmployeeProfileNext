"use client";

import React from "react";

import { useAppContext } from "../GlobalContext";

import { Employee } from "../schemas/EmployeeSchema";

import { Memo } from "../schemas/MemoSchema";

import Image from "next/image";

const EmployeeDetails = () => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    handleImageModalClick,
    handleMemoTableModalClick,
    serverRequests,
    userData,
    loading,
    setLoading,
    setToastOptions,
  } = useAppContext();

  const dummy = React.useRef<HTMLDivElement>(null);

  const [selectedEmployeeMemos, setSelectedEmployeeMemos] = React.useState(
    [] as Memo[]
  );

  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = React.useState(
    {} as Employee
  );

  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const [fetchingMemos, setFetchingMemos] = React.useState<boolean>(false);

  const detailStyle = () =>
    ` ${loading && "hidden"} 
    tracking-widest flex grow flex-col text-center  border border-base-300 rounded-xl bg-base-100 
    hover:bg-base-300 p-2 2xl:p-3
  `;

  const skeletonStyle = `
    ${selectedEmployeeDetails._id && !loading ? " hidden " : " block "} 
    ${loading ? " skeleton block" : " bg-base-300 rounded-xl "} shrink-0 
  `;

  const contentStyle = `${
    loading
      ? " hidden !m-0 xl:!p-5 !p-0 !w-0 !scale-0 "
      : selectedEmployeeDetails._id
      ? " block "
      : " hidden "
  }`;

  const getSelectedEmployeeDetails = async () => {
    setSelectedEmployeeDetails({} as Employee);
    setLoading(true);
    try {
      const res = await serverRequests.getEmployeeDetailsAction(
        userData,
        selectedEmployee?._id || ""
      );
      if (res?.data) {
        setSelectedEmployeeDetails(res.data);
      }
      if (res?.error) {
        setToastOptions({
          open: true,
          message: res.error,
          type: "error",
          timer: 5,
        });
        setErrorMessage(res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getMemosForEmployee = async () => {
    setSelectedEmployeeMemos([] as Memo[]);
    setFetchingMemos(true);
    try {
      const res = await serverRequests.getMemoList(
        userData,
        selectedEmployee?._id || ""
      );
      if (res?.data) {
        setSelectedEmployeeMemos(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchingMemos(false);
    }
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (userData?._id && selectedEmployee?._id) {
        getMemosForEmployee();
      }

      if (selectedEmployee._id) {
        getSelectedEmployeeDetails();
      }

      if (window.innerWidth < 768) {
        dummy.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }

      if (!selectedEmployee._id) {
        setSelectedEmployeeDetails({} as Employee);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [selectedEmployee, userData]);

  const onClear = () => {
    setSelectedEmployee({} as Employee);
    setLoading(false);
  };

  const handleDetailsClick = (textToCopy: string) => {
    setToastOptions({
      open: true,
      message: "Copied to clipboard",
      type: "info",
      timer: 2,
    });
    navigator.clipboard.writeText(textToCopy);
  };

  const detailComponent = () => {
    const xlist = [
      "name",
      "address",
      "resumePhotosList",
      "biodataPhotosList",
      "photoOfPerson",
      "_id",
      "_version",
      "dailyWage",
      "firstName",
      "lastName",
      "isDeleted",
    ];

    return (
      <>
        {Object.keys(selectedEmployeeDetails).map((key) => {
          if (!xlist.includes(key)) {
            return (
              <div key={key} className={detailStyle()}>
                <strong className="text-base select-all">
                  {selectedEmployeeDetails[key as keyof Employee] == true ? (
                    <strong>✔</strong>
                  ) : key == "dateJoined" ? (
                    selectedEmployeeDetails[key as keyof Employee]
                      ?.toString()
                      .substring(5, 17) || " ? "
                  ) : (
                    selectedEmployeeDetails[key as keyof Employee] || " ? "
                  )}
                </strong>

                <p className="capitalize">{key}</p>
              </div>
            );
          }
        })}
      </>
    );
  };

  const detailSkeleton = () => {
    return !selectedEmployeeDetails._id || loading ? (
      <>
        <div className={`w-full flex flex-wrap items-center gap-3`}>
          <div
            className={` ${skeletonStyle} w-24 xl:w-32 h-24 xl:h-32 !rounded-full`}
          >
             
          </div>
          <div className={`w-[60%] h-24 xl:h-32 flex flex-col justify-evenly`}>
            <div className={`${skeletonStyle} w-full h-[35%] `}> </div>
            <div className={`${skeletonStyle} w-[65%] h-[35%] `}> </div>
          </div>
          <div className={`${skeletonStyle} w-full h-3`}> </div>
          <div className={`${skeletonStyle} w-full h-3`}> </div>
        </div>
        <div className="w-full mt-2 mb-1 border-b"></div>
        <div
          className={
            skeletonStyle +
            " p-4 w-full bg-opacity-55 text-lg text-center tracking-widest"
          }
        >
          {!selectedEmployee?._id
            ? "Select an Employee"
            : selectedEmployee?._id && loading
            ? "Fetching..."
            : errorMessage
            ? errorMessage
            : "No Details Found"}
        </div>
        <div className={` ${skeletonStyle} md:24 md:w-32 h-12 grow`}> </div>
        <div className={` ${skeletonStyle} md:20 md:w-24 h-12 grow`}> </div>
        <div className={` ${skeletonStyle} md:20 md:w-24 h-12 grow`}> </div>
        <div className={` ${skeletonStyle} md:24 md:w-32 h-12 grow`}> </div>
        <div
          className={` ${skeletonStyle} md:20 md:w-24 h-12 grow hidden xl:block`}
        >
           
        </div>
      </>
    ) : null;
  };

  return (
    <div
      className={` ${
        loading && "cursor-wait"
      } relative h-full w-full flex flex-col overflow-auto rounded-xl shadow-lg border p-4 pt-5`}
      ref={dummy}
    >
      {/* avatar, name, address */}

      {/* clear button */}
      <div
        className={`${
          (!selectedEmployee._id || loading) && "hidden"
        } absolute top-0 right-0 cursor-pointer hover:bg-error`}
        onClick={onClear}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div
        className={` flex flex-wrap w-full gap-3 items-center md:items-start justify-center h-max border-b pb-3 pt-3 mb-2 lg:pb-4 lg:mb-6 ${
          Boolean(!selectedEmployeeDetails?._id) && "hidden"
        } `}
      >
        {/* avatar */}
        <div className={"flex justify-center items-center self-stretch " + contentStyle}>
          <div className=" indicator ">
            {/* indicator */}
            <span
              className={`
              ${loading && "hidden"} 
              ${
                selectedEmployeeMemos.length
                  ? " badge-error hover:bg-red-200 "
                  : fetchingMemos
                  ? " bg-warning animate-pulse "
                  : " bg-success "
              }
              cursor-pointer tooltip-top tooltip indicator-item badge text-white absolute `}
              data-tip={`${
                fetchingMemos ? "Fetching" : selectedEmployeeMemos?.length
              } Memos`}
              onClick={() =>
                selectedEmployeeMemos?.length &&
                handleMemoTableModalClick(selectedEmployeeMemos)
              }
            >
              {fetchingMemos ? "..." : selectedEmployeeMemos?.length}
            </span>
            {/* avatar Image */}
            <div
              className={` ${loading && "hidden"}
              w-20 2xl:w-28 h-20 2xl:h-28 ring-gray-700 ring-offset-base-100 ring-2 ring-offset-0 rounded-full overflow-clip cursor-pointer relative`}
              onClick={() =>
                selectedEmployeeDetails?.photoOfPerson &&
                handleImageModalClick([
                  selectedEmployeeDetails?.photoOfPerson || "",
                ])
              }
            >
              {selectedEmployeeDetails?.photoOfPerson ? (
                <Image
                  className={` w-full h-full`}
                  src={selectedEmployeeDetails?.photoOfPerson || "/avatar.png"}
                  alt={selectedEmployeeDetails?.firstName}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-base-300 grid place-items-center text-2xl font-bold">
                  ?
                </div>
              )}
            </div>
          </div>
        </div>

        {/* name */}
        <div
          className={` ${
            loading && " hidden"
          } pl-2 self-stretch min-w-[45%] max-w-[55%] xl:grow flex flex-wrap items-center justify-start select-all text-2xl xl:text-3xl 2xl:text-4xl font-semibold `}
          onClick={() =>
            handleDetailsClick(
              selectedEmployeeDetails?.firstName +
                " " +
                selectedEmployeeDetails?.lastName
            )
          }
        >
          <h2>{selectedEmployeeDetails?.firstName + " "}</h2> 
          <h2>{selectedEmployeeDetails?.lastName}</h2>  
        </div>

        {/* address */}
        <div
          className={` ${loading && " hidden"} ${
            !selectedEmployeeDetails?.address && "hidden"
          } text-center capitalize w-full`}
        >
          <h3
            className="select-all"
            onClick={() =>
              handleDetailsClick(selectedEmployeeDetails?.address || "")
            }
          >
            {selectedEmployeeDetails?.address || ""}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 h-max w-full text-xs pb-2 ">
        {detailSkeleton()}

        {detailComponent()}

        <div
          className={
            detailStyle() + ` ${!selectedEmployeeDetails._id && "hidden"}`
          }
        >
          <strong className="text-base">
            ₱ {selectedEmployeeDetails?.dailyWage?.toLocaleString() || " ? "}
          </strong>
          Daily Wage
        </div>

        <div
          className={
            detailStyle() + ` ${!selectedEmployeeDetails._id && "hidden"}`
          }
        >
          <strong className="text-base">
            {(selectedEmployee?.dateJoined &&
              Math.floor(
                (new Date().getTime() -
                  new Date(selectedEmployee?.dateJoined || "").getTime()) /
                  (1000 * 60 * 60 * 24)
              ).toLocaleString()) ||
              " ? "}
          </strong>
          Days with Us
        </div>

        {/* Resume */}
        <div
          className={
            `${detailStyle()} !flex-row w-full justify-evenly items-center` +
            ` ${!selectedEmployeeDetails._id && "hidden"}`
          }
          onClick={() =>
            selectedEmployeeDetails?.resumePhotosList &&
            handleImageModalClick(
              selectedEmployeeDetails?.resumePhotosList || []
            )
          }
        >
          Resume
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.resumePhotosList?.[0] || ""}
            alt={"Resume"}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div>

        {/* Bio-data */}
        <div
          className={
            `${detailStyle()} !flex-row w-full justify-evenly items-center` +
            ` ${!selectedEmployeeDetails._id && "hidden"}`
          }
          onClick={() =>
            selectedEmployeeDetails?.biodataPhotosList &&
            handleImageModalClick(
              selectedEmployeeDetails?.biodataPhotosList || []
            )
          }
        >
          Bio-data
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.biodataPhotosList?.[0] || ""}
            alt={"Bio-data"}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
