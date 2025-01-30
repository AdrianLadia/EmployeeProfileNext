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

  // const [daysWithUs, setDaysWithUs] = React.useState<number>(0);

  const detailStyle = (item: boolean) =>
    ` ${loading && "hidden"} p-2 2xl:p-3
    tracking-widest flex grow flex-col text-center  border border-base-300 rounded-xl bg-base-100 
    hover:bg-base-300 
  `;

  const skeletonStyle = `
    ${selectedEmployeeDetails.name && !loading ? " hidden " : " block "} 
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
    ];

    return (
      <>
        {Object.keys(selectedEmployeeDetails).map((key) => {
          if (!xlist.includes(key)) {
            return (
              <div
                key={key}
                className={detailStyle(
                  Boolean(selectedEmployeeDetails[key as keyof Employee])
                )}
              >
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
          return null;
        })}
      </>
    );
  };

  return (
    <div
      className={` ${
        loading && "cursor-wait"
      } relative h-full w-full flex flex-col overflow-auto rounded-xl shadow-lg border p-4 `}
      ref={dummy}
    >
      {/* avatar, name, address */}
      <div className="flex flex-wrap w-full gap-3 items-start justify-start h-max">
        {/* avatar */}
        <div className={"flex justify-center " + contentStyle}>
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
              className={`${!selectedEmployeeDetails?._id && "hidden"} ${
                loading && "hidden"
              }
              w-24 xl:w-36 h-24 xl:h-36 ring-gray-700 ring-offset-base-100 ring-2 ring-offset-0 rounded-full overflow-clip cursor-pointer relative`}
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
                  alt={selectedEmployeeDetails?.name}
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

        <div
          className={` ${
            loading && " hidden"
          } pl-2 grow self-stretch max-w-[60%] flex items-center justify-start`}
        >
          <h2
            className="text-2xl font-semibold select-all"
            onClick={() => handleDetailsClick(selectedEmployeeDetails?.name)}
          >
            {selectedEmployeeDetails?.name}
          </h2>
        </div>

        <div className={` ${loading && " hidden"} `}>
          <h3
            className="select-all"
            onClick={() =>
              handleDetailsClick(selectedEmployeeDetails?.address || "")
            }
          >
            {selectedEmployeeDetails?.address || " "}
          </h3>
        </div>
      </div>

      <div className="w-full border-b my-4 " />

      <div className="flex flex-wrap gap-3 h-max w-full text-xs pb-2 ">
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

        {detailComponent()}

        <div
          className={
            detailStyle(Boolean(selectedEmployeeDetails?.dailyWage)) +
            ` ${!selectedEmployeeDetails?._id && "hidden"}`
          }
        >
          <strong className="text-base">
            ₱ {selectedEmployeeDetails?.dailyWage?.toLocaleString() || " ? "}
          </strong>
          Daily Wage
        </div>

        <div
          className={
            detailStyle(Boolean(selectedEmployeeDetails?.dateJoined)) + ` `
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

        <div
          onClick={() =>
            handleImageModalClick(
              selectedEmployeeDetails?.resumePhotosList || []
            )
          }
          className={`${detailStyle(
            Boolean(selectedEmployeeDetails?.resumePhotosList?.[0])
          )} !flex-row ${loading && "hidden"} 
                p-2 xl:p-4 flex items-center justify-evenly cursor-pointer w-full rounded-xl`}
        >
          Resume
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.resumePhotosList?.[0] || ""}
            alt={selectedEmployeeDetails?.name}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div>

        <div
          onClick={() =>
            handleImageModalClick(
              selectedEmployeeDetails?.biodataPhotosList || []
            )
          }
          className={`${detailStyle(
            Boolean(selectedEmployeeDetails?.biodataPhotosList?.[0])
          )} !flex-row ${loading && "hidden"} 
             items-center justify-evenly cursor-pointer w-full rounded-xl`}
        >
          Bio-data
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.biodataPhotosList?.[0] || ""}
            alt={selectedEmployeeDetails?.name}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div>
      </div>

      {/* <div className="absolute flex justify-stretch bottom-2 gap-4 w-full text-center py-1 px-4"> 
 
        <div
          onClick={() =>
            handleImageModalClick(
              selectedEmployeeDetails?.resumePhotosList || []
            )
          }
          className={`${
            !selectedEmployeeDetails?.resumePhotosList?.[0] && "hidden"
          } ${loading && "hidden"} 
                p-2 xl:p-4 flex items-center justify-evenly bg-base-200 hover:bg-base-300 cursor-pointer hover:text-white w-full rounded-xl`}
        >
          Resume
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.resumePhotosList?.[0] || ""}
            alt={selectedEmployeeDetails?.name}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div> 


        <div
          onClick={() =>
            handleImageModalClick(
              selectedEmployeeDetails?.biodataPhotosList || []
            )
          }
          className={`${
            !selectedEmployeeDetails?.biodataPhotosList?.[0] && "hidden"
          } ${loading && "hidden"} 
            p-2 xl:p-4 flex items-center justify-evenly bg-base-200 hover:bg-base-300 cursor-pointer hover:text-white w-full rounded-xl`}
        >
          Bio-data
          <Image
            className={`w-8 h-8`}
            src={selectedEmployeeDetails?.biodataPhotosList?.[0] || ""}
            alt={selectedEmployeeDetails?.name}
            width={100}
            height={100}
            loading="lazy"
          ></Image>
        </div>
      </div> */}

      {/* <div className="py-6 pt-14 "> </div> */}
    </div>
  );
};

export default EmployeeDetails;
