"use client";

import React from "react";

const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: "24px",
  outline: 0,
  overflow: "clip",
};

import OffenseTable from "./OffenseTable";

import { useAppContext } from "../GlobalContext";

const OffenseTableModal = () => {
  const { offenseListForModal, pathname } = useAppContext();

  const contentRef = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState(false);

  const [hidden, setHidden] = React.useState(false);

  function convertToPdf() {
    setLoading(true);
    const element = contentRef.current;

    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Export HTML To Doc</title>
        <style> 
          body {
            text-align: center;
          }
          td {
            padding: 15px;
            text-align: left;
          }  
          th {
            padding: 5px;
            text-align: left;
            background-color: #f2f2f2;
          }
          #violation { 
            width: 55%;
          }
          #remedialActions { 
            width: 30%;
          }   
          #textStart {
            text-align: left; 
          }
          #textEnd {
            padding-top: 20px;
            text-align: right;
          } 
        </style>
      </head>
      <body>`;
    const postHtml = "</body></html>";

    if (!element) {
      console.error("Element not found");
      return;
    }
    const html = preHtml + element.innerHTML + postHtml;

    const url =
      "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);

    const filename = "house-rules.doc";

    const downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.click();

    document.body.removeChild(downloadLink);
    setLoading(false);
  }

  React.useEffect(() => {
    if (pathname === "/") {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [pathname]);

  const [year] = React.useState(new Date().getFullYear());

  // useEffect(() => {
  //   if (!offenseListForModal.length) {
  //     const timeout = setTimeout(() => {
  //       const modal = document.getElementById("OffenseDownloadModal");
  //       if (modal) {
  //         (modal as HTMLDialogElement)?.showModal();
  //       }
  //     }, 1000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [offenseListForModal]);

  if(!offenseListForModal.length) return null;

  return (
    <dialog className=" modal " id="OffenseDownloadModal">
      <div
        style={style}
        className={` relative h-[90vh] w-[98vw] md:w-[80vw] 2xl:w-[70vw] border bg-white text-black rounded-box`}
      >
        <div className="w-full h-full overflow-auto py-[8vh]">
          {/* CLOSE BUTTON */}
          <form
            className="absolute top-2 right-2 z-10"
            method="dialog"
            id="closeButton"
          >
            <button className=" close-button "></button>
          </form>

          {/* </ content ref */}
          <div ref={contentRef}>
            {/* COMPANY HOUSE  */}
            <div className="w-full flex justify-center pt-10 text-center md:text-start">
              <h1 className="text-xl md:text-2xl xl:text-3xl tracking-wider font-bold">
                COMPANY HOUSE RULES - {year}
              </h1>
            </div>
            {/* REMEDIAL ACTION */}
            <div className="w-full flex justify-center pb-10 text-center md:text-start">
              <h2 className="text-xl md:text-2xl xl:text-3xl tracking-wider font-bold">
                TABLE OF OFFENSES AND REMEDIAL ACTION
              </h2>
            </div>

            {/* OffenseTable */}
            <div className=" rounded-box rounded-t-none w-full ">
              <OffenseTable offenseList={offenseListForModal} forPrint={true} />
            </div>

            {/* THE MANAGEMENT */}
            <div
              className={`${
                hidden && "hidden"
              } flex justify-end gap-2 px-10 pt-16`}
            >
              <div
                className="text-xl w-[30%] font-bold tracking-wider"
                id="textEnd"
              >
                THE MANAGEMENT
              </div>
            </div>

            {/*  Printed Name< */}
            <div
              className={`${
                hidden && "hidden"
              } flex items-center flex-col gap-2 px-10 pt-16 w-[80%] md:w-[40%]`}
            >
              <div className=" border-b w-full border-black h-0">
                                  
              </div>
              <div id="textStart">Signature Over Printed Name:</div>
            </div>

            {/* Date */}
            <div
              className={`${
                hidden && "hidden"
              } flex items-center flex-col gap-2 px-10 pt-20 pb-10 w-[80%] md:w-[40%] `}
            >
              <div className=" border-b border-black w-full h-0">
                                  
              </div>
              <div id="textStart">Date:</div>
            </div>
          </div>
          {/* content ref /> */}

          <div
            className={`${
              hidden && "hidden"
            } absolute bottom-5 w-full justify-center flex`}
          >
            <button
              onClick={convertToPdf}
              className="btn btn-info"
              disabled={loading}
            >
              {!loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              ) : (
                <div className="text-xl animate-spin font-normal">C</div>
              )}
              Download
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default OffenseTableModal;
