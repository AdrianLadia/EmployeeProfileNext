import React from "react";

import Image from "next/image";

interface EmployeeIDViewProps {
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  setPhase: (phase: 1 | 2) => void;
  phase: 1 | 2;
  hasEmptyFields: boolean;
  loading: boolean;
  idURL: string;
}

const EmployeeIDView: React.FC<EmployeeIDViewProps> = ({
  handleSubmit,
  setPhase,
  hasEmptyFields,
  loading,
  idURL,
}) => {
  const renderPlaceholder = () => {
    const divStyle = loading ? " skeleton " : " bg-base-300 ";

    return (
      <div className="relative flex flex-col items-center justify-start min-w-full h-full py-4">
        {/*  */}
        <div className="flex justify-end items-center w-full gap-1.5">
          <div className={` bg-base-300 h-10 w-10 rounded-full `} />
          <div className="flex flex-col justify-center gap-1 w-[30%] ">
            <div className={` ${divStyle} h-4 w-[80%] `} />
            <div className={` ${divStyle} h-3 w-[45%] `} />
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col justify-start items-center w-full gap-2 h-[55%] mt-14 ">
          <div className="bg-base-100 h-40 md:h-48 w-40 md:w-48 rounded-full mb-2 border-8 p-0.5 border-base-300">
            <div className={` ${divStyle} h-full w-full rounded-full `} />
          </div>
        </div>

        {/*  */}
        <div className="flex justify-center items-center w-full gap-2">
          <div
            className={` ${divStyle} h-16 md:h-20 w-[80%] flex justify-center items-center p-2 gap-1 `}
          >
            <div className="bg-base-100 h-14 md:h-16 w-[75%] flex gap-1 flex-col p-1">
              <div className={` ${divStyle} h-10 md:h-12 w-[100%] `}></div>
              <div className={` ${divStyle} h-3 md:h-4 w-[80%] `}></div>
            </div>
            <div className="bg-base-100 h-14 md:h-16 w-[25%] p-1">
              <div className={` ${divStyle} h-12 md:h-14 w-[100%] `}></div>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="flex flex-col items-center w-full gap-2 mt-6">
          <div className={` ${divStyle} w-[35%] h-3 `}></div>
          <div className={` ${divStyle} w-[45%] h-3 `}></div>
        </div>
      </div>
    );
  };

  return (
    !hasEmptyFields && (
      <form
        className="carousel-item w-full flex relative flex-col justify-start items-center outline-none "
        onSubmit={handleSubmit}
        id="phase2"
        tabIndex={-1}
      >
        {/*  */}
        <div className="w-[75%] md:w-[480px] h-[83%]  shadow-md carousel border my-4">
          {loading || !idURL ? (
            renderPlaceholder()
          ) : (
            <Image
              className="min-w-full h-full"
              src={idURL || ""}
              height={300}
              width={300}
              alt="ID"
            />
          )}
          <div className="flex flex-col min-w-full h-full bg-base-200 "></div>
        </div>

        {/* actions */}
        <div className="flex justify-center absolute bottom-5 left-0 w-[100%] gap-2">
          <a
            href="#phase1"
            onClick={() => setPhase(1)}
            className="btn-outline btn-primary btn w-[43%] h-12"
            tabIndex={-1}
          >
            Back
          </a>
          <button
            type="submit"
            disabled={hasEmptyFields }
            tabIndex={-1}
            className={` btn-primary btn w-[43%] h-12 `}
          >
            {loading ? (
              <p className={`${loading && "animate-spin"} `}>C</p>
            ) : idURL? (
              "Update"
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </form>
    )
  );
};

export default EmployeeIDView;
