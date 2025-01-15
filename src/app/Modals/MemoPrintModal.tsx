import React, { useRef } from "react";

import { useAppContext } from "../GlobalContext";

import { Memo } from "../schemas/MemoSchema";

import html2canvas from "html2canvas-pro";

import jsPDF from "jspdf";

const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: "24px",
  outline: 0,
  overflow: "clip",
};

const PrintMemorandumModal = () => {
  const memoRef = useRef(null);

  const { memoForPrintModal, setMemoForPrintModal } = useAppContext();

  const [resolution, setResolution] = React.useState(3);

  const convertToPdf = async () => {
    // Desktop dimensions to simulate
    const desktopWidth = 1200; // Adjust as needed for desktop
    const desktopHeight = 800; // Adjust as needed for desktop

    // Store the original dimensions of the window
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    // Resize the window to simulate a desktop view
    window.innerWidth = desktopWidth;
    window.innerHeight = desktopHeight;

    // Trigger resize event to adjust the layout (if necessary)
    window.dispatchEvent(new Event("resize"));

    // Ensure element exists before proceeding
    const element = memoRef.current;
    if (!element) {
      console.error("Element not found");
      return;
    }

    try {
      // Capture the element with html2canvas
      const canvas = await html2canvas(element, {
        scale: resolution, // Higher scale for better quality
        useCORS: true, // Handles cross-origin images
      });

      // Get the image data from the canvas
      const imgData = canvas.toDataURL("image/png");

      // Define A4 paper dimensions in points (1 point = 1/72 inch)
      const A4_WIDTH = 595.28; // A4 width in points
      const A4_HEIGHT = 841.89; // A4 height in points

      // Calculate scaling to fit content within A4 size while maintaining aspect ratio
      const scaleX = A4_WIDTH / canvas.width;
      const scaleY = A4_HEIGHT / canvas.height;
      const scale = Math.min(scaleX, scaleY);

      // Calculate scaled dimensions
      const scaledWidth = canvas.width * scale;
      const scaledHeight = canvas.height * scale;

      // Create a new jsPDF instance with A4 format
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt", // Points (1 pt = 1/72 inch)
        format: "a4", // Set to A4
      });

      // Center the content on the A4 page
      const xOffset = (A4_WIDTH - scaledWidth) / 2;
      const yOffset = (A4_HEIGHT - scaledHeight) / 2;

      // Add the image to the PDF, scaled and centered
      pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

      // Save the PDF with a filename based on the employee's name
      pdf.save(`${memoForPrintModal?.Employee?.name}-Memorandum.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      // Restore the original window dimensions after the process
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;

      // Dispatch resize event to revert layout back to mobile (if necessary)
      window.dispatchEvent(new Event("resize"));
    }
  };

  // const convertToPdf = async () => {
  //   // Desktop dimensions to simulate
  //   const desktopWidth = 1200; // Adjust as needed for desktop
  //   const desktopHeight = 800; // Adjust as needed for desktop

  //   // Store the original dimensions of the window
  //   const originalWidth = window.innerWidth;
  //   const originalHeight = window.innerHeight;

  //   // Resize the window to simulate a desktop view
  //   window.innerWidth = desktopWidth;
  //   window.innerHeight = desktopHeight;

  //   // Trigger resize event to adjust the layout (if necessary)
  //   window.dispatchEvent(new Event("resize"));

  //   // Ensure element exists before proceeding
  //   const element = memoRef.current;
  //   if (!element) {
  //     console.error("Element not found");
  //     return;
  //   }

  //   try {
  //     // Capture the element with html2canvas
  //     const canvas = await html2canvas(element, {
  //       scale: resolution, // Higher scale for better quality
  //       useCORS: true, // Handles cross-origin images
  //     });

  //     // Get the image data from the canvas
  //     const imgData = canvas.toDataURL("image/png");

  //     // Create a new jsPDF instance, setting the format to match the canvas size
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "px",
  //       format: [canvas.width, canvas.height], // Match the canvas size
  //     });

  //     // Add the image data to the PDF, with appropriate scaling
  //     pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  //     // Save the PDF with a filename based on the employee's name
  //     pdf.save(`${memoForPrintModal?.Employee?.name}-Memorandum.pdf`);
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   } finally {
  //     // Restore the original window dimensions after the process
  //     window.innerWidth = originalWidth;
  //     window.innerHeight = originalHeight;

  //     // Dispatch resize event to revert layout back to mobile (if necessary)
  //     window.dispatchEvent(new Event("resize"));
  //   }
  // };

  const headerTextStyle = ` col-span-1 lg:col-span-4 indent-4 lg:indent-0 mb-4 lg:mb-0 text-sm md:text-base `;
  return (
    <dialog className=" modal " id="MemoPrintModal">
      <div
        style={style}
        className={` relative h-[90vh] w-[95vw] sm:w-[500px] md:min-w-[50vw] border bg-white text-black`}
      >
        <div className="w-full h-full overflow-auto pt-8 ">
          <div
            className=" gap-2 flex flex-col justify-center items-center absolute top-3 left-2 tooltip-bottom tooltip group "
            data-tip={`Quality`}
          >
            <input
              type="range" 
              min={1}
              max="3"
              step="1"
              value={resolution}
              placeholder="Resolution"
              className="range z-10 opacity-50 hover:opacity-100"
              onChange={(e) => setResolution(parseInt(e.target.value))}
            />
            <div className="absolute -z-10 text-xs flex justify-between w-full px-2 font-bold">
              <p className="text-xs">|</p>
              <p className="text-xs">|</p>
              <p className="text-xs">|</p>
            </div>
          </div>

          <form
            className="absolute top-2 right-2"
            method="dialog"
            id="closeButton"
          >
            <button
              onClick={() => setMemoForPrintModal({} as Memo)}
              className=" close-button "
            >
              
            </button>
          </form>

          <div className="h-max w-full pt-3 px-4 pb-3 bg-white" ref={memoRef}>
            <h1 className="text-3xl"> Memorandum </h1>

            {/* Header */}
            <div className="my-5 border-l pl-4 grid grid-cols-1 lg:grid-cols-5 items-center lg:gap-4">
              <div className="col-span-1 font-semibold">To:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.Employee?.name}
              </div>

              <div className="col-span-1 font-semibold">From:</div>
              <div className={headerTextStyle}>THE MANAGEMENT</div>

              <div className="col-span-1 font-semibold">Date:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.date?.substring(0, 16)}
              </div>

              <div className="col-span-1 font-semibold">Subject:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.subject}
              </div>

              <div className="col-span-1 font-semibold">Code:</div>
              <div className={headerTextStyle}>
                {/* {`( ${memoForPrintModal?.MemoCode?.number} ) - `} */}
                {memoForPrintModal?.Code}
              </div>
            </div>

            <div className=" my-8 w-full border-b-2" />

            {/* memo message */}
            <div className="px-2 ">
              <h3>
                Dear Mr./Ms.{" "}
                <strong>{memoForPrintModal?.Employee?.name}</strong> ,
              </h3>
              <br />
              {/* <p className="indent-4 whitespace-pre-line underline underline-offset-8 hyphens-auto text-justify leading-9"> */}
              <p className="indent-4 whitespace-pre-line ">
                {memoForPrintModal?.description}
              </p>
              <br />
              <div className="float-end w-[75%] md:w-[50%] xl:w-[35%] border-b text-center pb-2 border-black">
                  THE MANAGEMENT  
              </div>
              <br />
              <br />
            </div>

            <div className="my-8 w-full border-b-2" />

            {/* employee explanation */}
            <div className=" w-full ">
              <span>Please write your explanation:</span>
              <br />
              <br />
              <br />
              {memoForPrintModal?.reason ? (
                // <p className="indent-4 whitespace-pre-line underline underline-offset-8 hyphens-auto text-justify leading-9">
                <p className="indent-4 whitespace-pre-line ">
                  {memoForPrintModal?.reason}
                </p>
              ) : (
                [0, 1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="w-full border-b border-gray-500 mb-1.5 " />
                    <br />
                  </div>
                ))
              )}
              <br />
              <br />
              <div className="float-end w-[75%] md:w-[50%] xl:w-[35%]  ">
                <div className=" border-b text-center mb-2 border-black"></div>
                <div className=" text-center text-xs">
                  (Name, Signature, Date)
                </div>
              </div>
              <br />
              <br />
              <br />
            </div>

            {/* remedial actions */}
            <div className="px-2 border-t-2">
              <br />
              <div className=" flex flex-wrap ">
                <span className="grow-0">Gravity of Offense: </span>
                <span className="grow border-b border-black p-3"></span>
              </div>
              <br />
              <div className="flex flex-wrap">
                Remedial Action:
                {memoForPrintModal?.MemoCode?.remedialActions[0] && (
                  <p className="indent-4 whitespace-pre-line underline underline-offset-8 text-red-500">
                     {memoForPrintModal?.MemoCode?.remedialActions[0]} 
                  </p>
                )}
              </div>
            </div>

            {/*  */}
            <div className="mt-8 w-full border-b-2" />
            <div className=" text-center w-full mt-2">
              {" "}
              For management use only{" "}
            </div>
          </div>
        </div>

        {/* Print Memo Button */}
        <div className="w-full absolute bottom-5 flex justify-center">
          <button
            className=" w-max btn btn-info text-white opacity-50 hover:opacity-100"
            onClick={() => convertToPdf()}
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
            <span className=" ">Download</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default PrintMemorandumModal;
