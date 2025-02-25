"use client";

import React from "react";

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

  // if (!offenseListForModal.length) return null;

  return (
    <dialog className=" modal " id="OffenseDownloadModal">
      <div
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
          <div
            ref={contentRef}
            className="flex flex-col items-center justify-center"
          >
            {/* COMPANY HOUSE  */}
            <div className="w-full flex justify-center pt-10 text-center md:text-start">
              <h1 className="text-xl md:text-2xl xl:text-3xl tracking-wider font-bold">
                COMPANY HOUSE RULES - {year}
              </h1>
              <br />
              <br />
              <br />
            </div>

            {/* intro */}
            {!hidden && (
              <>
                <div
                  id="textStart"
                  className="w-[90%] flex flex-col justify-center text-start "
                >
                  The management is committed to uphold the basic rights of the
                  employees specially enshrined with the Labor Code of the
                  Philippines.
                  <br />
                  <br />
                  With regard to disciplinary action(s), substantial or
                  disciplinary action(s) must be pursuant to either a just or an
                  authorized cause under Articles (282) 297, (283) 298 or (284)
                  299 of the Labor Code, this also includes the Company Rules
                  and Regulations.
                  <br />
                  <br />
                  <br />
                  ART. 297. (282) Termination by Employer. An employer may
                  terminate an employment for any of the following causes:
                  <br />
                  <br />
                  <div className="px-4 text-start">
                    a. Serious misconduct or willful disobedience by the
                    employee of the lawful orders of his employer or
                    representative in connection with his work;
                    <br />
                    <br />
                    b. Gross and habitual neglect by the employee of his duties;
                    <br />
                    <br />
                    c. Fraud or willful breach by the employee of the trust
                    reposed in him by his employer or duly authorized
                    representative;
                    <br />
                    <br />
                    d. Commission of a crime or offense by the employee against
                    the person of his employer or any immediate member of his
                    family or his duly authorized representatives; and
                    <br />
                    <br />
                    e. Other causes analogous to the foregoing
                  </div>
                </div>

                <div id="textStart" className="w-[90%] indent-4 ">
                  <br />
                  <br />
                  ART .298 (283) Closure of Establishment and Reduction of
                  Personnel. The employer may also terminate the employment of
                  any employee due to the installation of labor-saving devices,
                  redundancy , retrenchment to prevent losses or the closing or
                  cessation of operation of the establishment or undertaking
                  unless the closing is for the purpose of circumventing the
                  provisions of this Title , by serving a written notice on the
                  workers and the Ministry of Labor and Employment at least one
                  (1) month before the intended date thereof. In case of
                  termination due to the installation of labor-saving devices or
                  redundancy, the worker affected thereby shall be entitled to a
                  separation pay equivalent to the least one(1) month pay or to
                  at least one (1) month pay for every year of service,
                  whichever is higher. In case of retrenchment to prevent losses
                  and in case of closures or cessation of operations of the
                  establishment or undertaking not due to serious business
                  losses or financial reverses, the separation pay shall be
                  equivalent to one (1) month pay or at least one-half (½) month
                  pay for every year of service, whichever is higher. A fraction
                  of at least six (6) months shall be considered one (1) whole
                  year.
                  <br />
                  <br />
                </div>

                <div id="textStart" className="w-[90%] indent-4 ">
                  <br />
                  ART.299. (284) Disease as Ground for Termination. An employer
                  may terminate the services of an employee who has been found
                  suffering from any disease and whose continued employment is
                  prohibited by law or is prejudicial to his health as well as
                  to the health of his co-employees: Provided , That he is paid
                  separation pay equivalent to at least one (1) month salary or
                  to one-half(½) month salary for every year of service
                  whichever is greater, a fraction of at least six (6) months
                  being considered as one (1) whole year.
                  <br />
                  <br />
                </div>

                <div id="textStart" className="w-[90%] flex flex-col ">
                  <br />
                  <span className="indent-4">
                    On the other hand , procedural due process in dismissal
                    cases consists of the twin requirements of notice and
                    hearing.
                  </span>
                  <br />
                  <br />

                  <span className="indent-4">
                    All infractions committed by an employee must be penalized
                    according to the intensity or gravity and impact to the
                    company and its co-employees.
                  </span>
                  <br />
                  <br />

                  <span className="indent-4">
                    In disciplinary action cases, any report for infraction
                    shall be written form through incident report . The incident
                    report shall specify persons involved, the details of the
                    incident such as time, place, the kind of infraction
                    committed and must be signed by the reporter.
                  </span>
                  <br />
                  <br />
                  <br />
                </div>

                <div id="textStart" className="w-[90%] indent-4 pb-10">
                  After the receipt of the incident report, the Human Resource
                  Office shall issue a NOTICE TO EXPLAIN addressed to the
                  persons involved attached to it is the photocopy of the
                  incident report and evidence at hand. In the NTE, the
                  infraction shall be specified and the details shall be stated
                  clearly. It should state that the persons involved are ordered
                  to submit his written explanation within five (5) days from
                  receipt thereof. Failure on his part to submit a written
                  explanation shall be considered a waiver on his part to be
                  heard.
                  <br />
                  <br />
                </div>

                <div className="w-[90%] pb-10">
                  <h3 className="text-center font-bold text-xl">Condonation</h3>
                  <p className="text-center">
                    The infractions committed by an employee shall be considered
                    condoned after five years from its commission or discovery.
                  </p>
                </div>
              </>
            )}

            {/* REMEDIAL ACTION */}
            <div className="w-full flex justify-center pb-10 text-center md:text-start">
              <h2 className="text-xl md:text-2xl xl:text-3xl tracking-wider font-bold">
                TABLE OF OFFENSES AND REMEDIAL ACTION
              </h2>
            </div>

            {/* OffenseTable */}
            {!!offenseListForModal?.length ? <div className=" rounded-box rounded-t-none w-full ">
              <OffenseTable offenseList={offenseListForModal } forPrint={true} />
            </div> : "No Offense Found"}

            {/*  Printed Name< */}
            <div
              className={`${
                hidden && "hidden"
              } flex items-start flex-col gap-2 pt-20 w-[90%] `}
            >
              <div className="w-[300px] ">
                <div className=" border-b w-full border-black h-0" />
                <div id="textStart" className="text-center ">
                  Signature Over Printed Name:
                </div>
              </div>
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
