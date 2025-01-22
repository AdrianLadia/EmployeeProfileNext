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
    `${!item && "hidden"} ${loading && "hidden"} p-2 2xl:p-3
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
                      .substring(5, 17)
                  ) : (
                    selectedEmployeeDetails[key as keyof Employee]
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
      } relative h-full w-full flex flex-col justify-start items-center rounded-xl shadow-lg border p-4 `}
      ref={dummy}
    >
      {/* clear button */}
      <button
        onClick={() => onClear()}
        className={`${
          !selectedEmployee?._id && "hidden"
        } absolute top-2 right-2 hover:text-error `}
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
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>
      </button>

      {/* avatar skelly */}
      <div
        className={
          skeletonStyle +
          " !rounded-full py-3 xl:py-8 w-24 xl:w-36 h-24 xl:h-36 mt-2 mb-4"
        }
      ></div>

      {/* avatar */}
      <div
        className={" w-full flex justify-center py-3 xl:py-8 " + contentStyle}
      >
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

      {/* employee name & address skelly*/}
      <div
        className={skeletonStyle + " h-8 w-[40%] mb-1 xl:mb-3 xl:mt-4"}
      ></div>
      <div className={skeletonStyle + " h-6 w-[70%] "}></div>

      {/* employee name & address */}
      <div
        className={`${!selectedEmployeeDetails?.name && " hidden"} ${
          loading && " hidden"
        } `}
      >
        <h2
          className="text-2xl font-semibold select-all"
          onClick={() => handleDetailsClick(selectedEmployeeDetails?.name)}
        >
          {selectedEmployeeDetails?.name}
        </h2>
      </div>
      <div
        className={`${!selectedEmployeeDetails?.address && " hidden"} ${
          loading && " hidden"
        }`}
      >
        <h3
          className="select-all"
          onClick={() =>
            handleDetailsClick(selectedEmployeeDetails?.address || "")
          }
        >
          {selectedEmployeeDetails?.address}
        </h3>
      </div>

      <div className="w-full border-b my-4 " />

      <div className="flex flex-wrap gap-3 items-stretch w-full overflow-x-hidden h-max text-xs overflow-auto max-h-[70%] pb-2 ">
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

        {/* details skelly */}
        <div className={skeletonStyle + " h-12 w-40 grow"}></div>
        <div className={skeletonStyle + " h-12 w-28 grow"}></div>
        <div className={skeletonStyle + " h-12 w-32 grow"}></div>
        <div className={skeletonStyle + " h-12 w-40 grow"}></div>

        {detailComponent()}

        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.dailyWage))}
        >
          <strong className="text-base">
            ₱ {selectedEmployeeDetails?.dailyWage?.toLocaleString()}
          </strong>
          Daily Wage
        </div>

        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.dateJoined))}
        >
          <strong className="text-base">
            {selectedEmployee?.dateJoined &&
              Math.floor(
                (new Date().getTime() -
                  new Date(selectedEmployee?.dateJoined || "").getTime()) /
                  (1000 * 60 * 60 * 24)
              ).toLocaleString()}
          </strong>
          Days with Us
        </div>

        {/* details */}
        {/* <div className={detailStyle(Boolean(selectedEmployeeDetails?.company))}>
          <strong className="text-base">
            {selectedEmployeeDetails?.company}
          </strong>
          Company
        </div>
        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.dateJoined))}
        >
          <strong className="text-base">
            {selectedEmployeeDetails?.dateJoined?.substring(5, 17)}
          </strong>
          Joined
        </div>
        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.dailyWage))}
        >
          <strong className="text-base">
            ₱ {selectedEmployeeDetails?.dailyWage?.toLocaleString()}
          </strong>
          Daily Wage
        </div>
        <div className={detailStyle(Boolean(selectedEmployeeDetails?.email))}>
          <strong
            className="text-base select-all"
            onClick={() =>
              handleDetailsClick(selectedEmployeeDetails?.email || "")
            }
          >
            {selectedEmployeeDetails?.email}
          </strong>
          Email
        </div>
        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.phoneNumber))}
        >
          <strong
            className="text-base select-all"
            onClick={() =>
              handleDetailsClick(selectedEmployeeDetails?.phoneNumber || "")
            }
          >
            {selectedEmployeeDetails?.phoneNumber}
          </strong>
          Phone
        </div>
        <div
          className={detailStyle(
            Boolean(selectedEmployeeDetails?.isProductionEmployee)
          )}
        >
          <strong className="text-base">✔</strong>
          isProduction
        </div>
        <div
          className={detailStyle(Boolean(selectedEmployeeDetails?.isRegular))}
        >
          <strong className="text-base">✔</strong>
          isRegular
        </div>
         */}
      </div>

      <div className="absolute flex justify-stretch bottom-2 gap-4 w-full text-center py-1 px-4">
        {/* resumePhotosList && biodataPhotosList skelly */}
        <div className={skeletonStyle + " h-12 w-[48%]"}></div>
        <div className={skeletonStyle + " h-12 w-[48%]"}></div>

        {/* resumePhotosList */}
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
        {/* biodataPhotosList */}
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
      </div>
      <div className="py-6 pt-14 "> </div>
    </div>
  );
};

export default EmployeeDetails;
