import React, { useRef } from "react";

import { useAppContext } from "../GlobalContext";

import { Memo } from "../schemas/MemoSchema";

import html2canvas from "html2canvas-pro";

import jsPDF from "jspdf";

import Image from "next/image";

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
  const memoRef = useRef<HTMLDivElement>(null);
  const memoImgRef = useRef<HTMLDivElement>(null);
  const mediaListRef = useRef<HTMLDivElement>(null);

  const mediaListRefs = React.useRef<React.RefObject<HTMLDivElement>[]>([]);
  const memoImageListRefs = React.useRef<React.RefObject<HTMLDivElement>[]>([]);

  const {
    memoForPrintModal,
    setMemoForPrintModal,
    getOrdinal,
    loading,
    setLoading,
  } = useAppContext();

  const [resolution, setResolution] = React.useState(3);

  const [includeMemoPhotos, setIncludeMemoPhotos] = React.useState(true);
  const [includeMediaList, setIncludeMediaList] = React.useState(true);

  const convertToPdf = async () => {
    setLoading(true);

    const desktopWidth = 1280;
    const desktopHeight = 800;

    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;

    window.innerWidth = desktopWidth;
    window.innerHeight = desktopHeight;
    window.dispatchEvent(new Event("resize"));

    const element = memoRef.current;
    if (!element) {
      console.error("Element not found");
      setLoading(false);
      return;
    }

    try {
      const A4_WIDTH = 595.28; // Width of A4 in points
      const A4_HEIGHT = 841.89; // Height of A4 in points
      const MARGIN = 10; // Margin around content
      const PAGE_BREAK_SEARCH_RANGE = 100; // Range to search for whitespace

      // Apply styles for rendering
      element.style.width = `${A4_WIDTH - MARGIN * 2}px`;
      element.style.maxWidth = `${A4_WIDTH - MARGIN * 2}px`;
      element.style.height = "auto";
      element.style.overflow = "visible";

      // Create canvas of the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        width: A4_WIDTH - MARGIN * 2,
        backgroundColor: "#ffffff",
      });

      // Create a temporary canvas to detect whitespace
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      if (!tempCtx) {
        console.error("tempCtx is null");
        return;
      }

      tempCtx?.drawImage(canvas, 0, 0);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
        compress: true,
      });

      const availW = A4_WIDTH - MARGIN * 2;
      const availH = A4_HEIGHT - MARGIN * 2;
      const GAP = 10;
      const ROWS_PER_PAGE = 3;
      const rowH = (availH - GAP * (ROWS_PER_PAGE - 1)) / ROWS_PER_PAGE;

      const renderPhotoGrid = async (
        count: number,
        mediaTypes: (string | undefined)[],
        getElement: (i: number) => HTMLElement | null | undefined
      ) => {
        let pageStarted = false;
        let x = MARGIN;
        let y = MARGIN;

        for (let index = 0; index < count; index++) {
          if (mediaTypes[index]?.includes("video")) continue;

          const mediaElement = getElement(index);
          if (!mediaElement) {
            console.error("Media element not found at index", index);
            continue;
          }

          const originalWidth = mediaElement.style.width;
          mediaElement.style.width = `${availW}px`;
          const mediaCanvas = await html2canvas(mediaElement, {
            scale: 2,
            useCORS: true,
            width: availW,
            backgroundColor: "#ffffff",
          });
          mediaElement.style.width = originalWidth;

          if (!mediaCanvas.width || !mediaCanvas.height) {
            console.error("Empty media canvas at index", index);
            continue;
          }

          const imgData = mediaCanvas.toDataURL("image/png");
          const ratio = mediaCanvas.width / mediaCanvas.height;

          let drawH = rowH;
          let drawW = drawH * ratio;
          if (drawW > availW) {
            drawW = availW;
            drawH = drawW / ratio;
          }

          if (!pageStarted) {
            pdf.addPage();
            pageStarted = true;
            x = MARGIN;
            y = MARGIN;
          } else if (x > MARGIN && x + drawW > MARGIN + availW) {
            x = MARGIN;
            y += rowH + GAP;
          }

          if (y + rowH > MARGIN + availH) {
            pdf.addPage();
            x = MARGIN;
            y = MARGIN;
          }

          pdf.addImage(imgData, "PNG", x, y, drawW, drawH);
          x += drawW + GAP;
        }
      };

      const effectivePageHeight = A4_HEIGHT - MARGIN * 2;

      const pageRatio = canvas.width / (A4_WIDTH - MARGIN * 2);
      const pixelsPerPage = Math.floor(effectivePageHeight * pageRatio);

      const totalPages = Math.ceil(canvas.height / pixelsPerPage);

      const findBreakpoint = (y: number) => {
        if (y >= canvas.height) return canvas.height;

        const searchStart = Math.max(0, y - PAGE_BREAK_SEARCH_RANGE);
        const searchEnd = Math.min(canvas.height, y + PAGE_BREAK_SEARCH_RANGE);

        const imageData = tempCtx.getImageData(
          0,
          searchStart,
          canvas.width,
          searchEnd - searchStart
        );
        const data = imageData.data;

        const whiteRows = [];

        for (let row = 0; row < searchEnd - searchStart; row++) {
          let whitePixelCount = 0;
          let totalPixels = 0;

          for (let col = 0; col < canvas.width; col++) {
            const pixelIndex = (row * canvas.width + col) * 4;
            if (
              data[pixelIndex] > 240 &&
              data[pixelIndex + 1] > 240 &&
              data[pixelIndex + 2] > 240
            ) {
              whitePixelCount++;
            }
            totalPixels++;
          }

          if (whitePixelCount / totalPixels > 0.95) {
            whiteRows.push(row + searchStart);
          }
        }

        if (whiteRows.length > 0) {
          whiteRows.sort((a, b) => Math.abs(a - y) - Math.abs(b - y));
          return whiteRows[0];
        }

        return y;
      };

      for (let page = 0; page < totalPages; page++) {
        const idealY = (page + 1) * pixelsPerPage;

        const breakY = findBreakpoint(idealY);

        const pageHeight =
          page === totalPages - 1
            ? canvas.height - page * pixelsPerPage
            : breakY - page * pixelsPerPage;

        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeight;

        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0,
            page * pixelsPerPage,
            canvas.width,
            pageHeight,
            0,
            0,
            canvas.width,
            pageHeight
          );
        } else {
          console.error("pageCtx is null");
        }

        const imgData = pageCanvas.toDataURL("image/png");

        if (page > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          "PNG",
          MARGIN,
          MARGIN,
          A4_WIDTH - MARGIN * 2,
          (pageHeight / pageCanvas.width) * (A4_WIDTH - MARGIN * 2)
        );
      }

      if (memoForPrintModal?.mediaList?.length && includeMediaList) {
        await renderPhotoGrid(
          memoForPrintModal.mediaList.length,
          memoForPrintModal.mediaList,
          (i) => mediaListRefs.current[i]?.current
        );
      }

      if (
        memoForPrintModal?.memoPhotosList?.length &&
        includeMemoPhotos &&
        includeMediaList
      ) {
        await renderPhotoGrid(
          memoForPrintModal.memoPhotosList.length,
          memoForPrintModal.memoPhotosList,
          (i) => memoImageListRefs.current[i]?.current
        );
      }
      pdf.save(`${memoForPrintModal?.Employee?.firstName}-Memorandum.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      if (element) {
        element.style.width = "";
        element.style.maxWidth = "";
        element.style.height = "";
        element.style.overflow = "";
      }

      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      window.dispatchEvent(new Event("resize"));
      setLoading(false);
    }
  };

  const headerTextStyle = ` col-span-1 lg:col-span-4 indent-4 lg:indent-0 mb-4 lg:mb-0 `;

  return (
    <dialog
      className={` modal ${loading && " cursor-wait "} `}
      id="MemoPrintModal"
    >
      <div
        style={style}
        className={` relative h-[100svh] w-[100vw] sm:w-[500px] md:min-w-[50vw] border bg-white text-black text-xs`}
      >
        <div className="w-full h-full overflow-auto pt-8 ">
          <div
            className=" gap-2 flex flex-col justify-center items-center absolute top-3 left-2 tooltip-bottom tooltip group z-50 "
            data-tip={`Quality`}
          >
            <div className="relative h-full   ">
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
              {/* resolution */}
              <div className=" -z-10 absolute -top-0.5 h-full flex justify-between w-full px-2 font-bold">
                <p className="h-[80%] border-l border-neutral-content mt-0.5 ml-1"></p>
                <p className="h-[80%] border-l border-neutral-content mt-0.5"></p>
                <p className="h-[80%] border-l border-neutral-content mt-0.5 mr-1"></p>
              </div>
            </div>
          </div>

          <div className="opacity-50 hover:opacity-100 flex justify-center items-center absolute md:top-3 top-14 left-1/2 right-1/2 translate-x-[-50%] gap-2 w-max mt-0.5 ">
            {memoForPrintModal?.mediaList?.[0] &&
              !memoForPrintModal?.mediaList?.[0]?.includes("video") && (
                <>
                  <label htmlFor="mediaList"> Media List</label>
                  <input
                    className="checkbox "
                    type="checkbox"
                    name="mediaList"
                    checked={includeMediaList}
                    onChange={() => setIncludeMediaList(!includeMediaList)}
                    id="mediaList"
                  />
                </>
              )}
            {memoForPrintModal?.memoPhotosList?.[0] && (
              <>
                <input
                  className="checkbox "
                  type="checkbox"
                  name="Memo Photo"
                  checked={includeMemoPhotos}
                  onChange={() => setIncludeMemoPhotos(!includeMemoPhotos)}
                  id="Memo Photo"
                />
                <label htmlFor="Memo Photo"> Memo Photo</label>
              </>
            )}
          </div>

          <form
            className="absolute top-2 right-2"
            method="dialog"
            id="closeButton"
          >
            <button
              onClick={() => setMemoForPrintModal({} as Memo)}
              className=" close-button "
            ></button>
          </form>

          {/* printable div */}
          <div className="h-max w-full pt-3 px-4 pb-3 bg-white " ref={memoRef}>
            {/* <h1 className="text-3xl"> Memorandum </h1> */}
            <h1 className="text-2xl text-center uppercase font-serif tracking-tighter">
              {" "}
              {memoForPrintModal?.Employee?.agency ||
                "Pustanan Printers - Cebu"}{" "}
            </h1>
            <h2 className="text-base text-center uppercase font-serif tracking-tighter">
              {" "}
              Memorandum and Explanation Notice{" "}
            </h2>

            <br />

            {/* Header */}
            <div className="my-3 border-l pl-4 grid grid-cols-1 lg:grid-cols-5 items-center lg:gap-0.5">
              <div className="col-span-1 font-semibold">To:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.Employee?.firstName} 
                {memoForPrintModal?.Employee?.lastName}
              </div>

              <div className="col-span-1 font-semibold">From:</div>
              <div className={headerTextStyle}>THE MANAGEMENT</div>

              <div className="col-span-1 font-semibold">Date:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.date?.substring(0, 10)}
              </div>

              <div className="col-span-1 font-semibold">Subject:</div>
              <div className={headerTextStyle}>
                {memoForPrintModal?.subject}
              </div>

              <div className="col-span-1 font-semibold">Code:</div>
              <div className={headerTextStyle}>{memoForPrintModal?.Code}</div>
            </div>

            <div className=" mt-4 mb-3 w-full border-b-2" />

            {/* memo message */}
            <div className="px-2 ">
              <h3 className="mb-1">
                Dear Mr./Ms.{" "}
                <strong>
                  {memoForPrintModal?.Employee?.firstName} 
                  {memoForPrintModal?.Employee?.lastName}
                </strong>{" "}
                ,
              </h3>
              <p className="indent-4 whitespace-pre-line mb-2">
                {memoForPrintModal?.description}
              </p>
              {/* <br /> */}
              <div className="float-end w-[75%] md:w-[50%] xl:w-[35%] border-b text-center pb-1 border-black">
                  THE MANAGEMENT  
              </div>
              <br />
              <br />
            </div>

            {/* employee explanation */}
            {!memoForPrintModal?.submitted && !memoForPrintModal.reason ? (
              <>
                <div className="my-3 w-full border-b-2" />

                <span>Please write your explanation:</span>
                <br />
                <br />
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="w-full border-b border-gray-500 mb-1.5 " />
                    <br />
                  </div>
                ))}
                <br />
                <div className="float-end w-[75%] md:w-[50%] xl:w-[35%]  ">
                  <div className=" border-b text-center mb-2 border-black"></div>
                  <div className=" text-center">(Name, Signature, Date)</div>
                </div>
                <br />
                <br />
                <br />
              </>
            ) : !memoForPrintModal?.submitted && memoForPrintModal.reason ? (
              <>
                <br />
              </>
            ) : (
              <>
                <br />
              </>
            )}

            {/* remedial actions */}
            <div className="px-2 border-t-2">
              <br />
              <div className="flex flex-col">
                Remedial Actions:
                <div className="flex flex-wrap gap-3 pt-1 ">
                  {memoForPrintModal?.MemoCode?.remedialActions?.map(
                    (action, index) => (
                      <>
                        <div
                          key={index}
                          className={`${
                            action !== memoForPrintModal?.remedialAction
                              ? " border border-neutral "
                              : " bg-neutral text-neutral-content "
                          } py-0.5 px-3 rounded-box relative text-xs`}
                        >
                          {action}
                          <span
                            className={`${
                              action !== memoForPrintModal?.remedialAction
                                ? " border border-neutral "
                                : " bg-neutral text-neutral-content "
                            } absolute top-[-10px] badge z-30 px-0.5 !text-xs !py-0 `}
                          >
                            {getOrdinal(index + 1)}
                          </span>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>

            {/*  */}
            <div className="mt-8 w-full border-b-2" />
            <div className=" text-center w-full mt-2">
              {" "}
              For management use only{" "}
            </div>
          </div>

          {/* medialist */}
          <div ref={mediaListRef}>
            {memoForPrintModal?.mediaList?.length &&
              memoForPrintModal?.mediaList?.map((media, index) => {
                mediaListRefs.current[index] =
                  mediaListRefs.current[index] ||
                  React.createRef<HTMLDivElement>();
                return (
                  <div
                    hidden={
                      !media?.includes("video") && includeMediaList
                        ? false
                        : true
                    }
                    key={index + media}
                    className="h-full w-full py-8 px-4 bg-white"
                    ref={mediaListRefs.current[index]}
                  >
                    <Image
                      className="w-full h-full"
                      src={media || ""}
                      width={400}
                      height={400}
                      alt="mediaList"
                    />
                  </div>
                );
              })}
          </div>

          {/* memoPhotosList */}
          <div ref={memoImgRef}>
            {memoForPrintModal?.memoPhotosList?.length &&
              memoForPrintModal?.memoPhotosList?.map((media, index) => {
                memoImageListRefs.current[index] =
                  memoImageListRefs.current[index] ||
                  React.createRef<HTMLDivElement>();
                return (
                  <div
                    hidden={
                      !media?.includes("video") && includeMediaList
                        ? false
                        : true
                    }
                    key={index + media}
                    className="h-full w-full py-8 px-4 bg-white"
                    ref={memoImageListRefs.current[index]}
                  >
                    <Image
                      className="w-full h-full"
                      src={media || ""}
                      width={400}
                      height={400}
                      alt="memoPhotosList"
                    />
                  </div>
                );
              })}
          </div>
        </div>

        <div className="w-full absolute bottom-5 flex justify-center">
          <button
            className={`${
              !loading ? " btn-info " : " btn-disabled "
            } w-max btn  text-white opacity-70 hover:opacity-100 z-40 `}
            onClick={() => !loading && convertToPdf()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${loading && "loading "} size-6`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default PrintMemorandumModal;
