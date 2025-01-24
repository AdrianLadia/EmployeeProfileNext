import React from "react";

interface EmployeeIDViewProps {
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  setPhase: (phase: 1 | 2) => void;
  hasEmptyFields: boolean;
}

const EmployeeIDView: React.FC<EmployeeIDViewProps> = ({
  handleSubmit,
  setPhase,
  hasEmptyFields,
}) => {
  return (
    !hasEmptyFields && (
      <form
        className="carousel-item w-full flex relative flex-col justify-start items-center "
        onSubmit={handleSubmit}
        id="phase2"
      >
        <div className=" flex flex-col items-center justify-between w-2/3 lg:w-[60%] h-[83%] rounded-box shadow-md border mb-[50px] py-4">
          <div className="flex justify-center items-center w-full">
            <div className="bg-base-300 h-8 w-8 rounded-full mr-2" />
            <div className="bg-base-300 h-4 w-[30%]" />
          </div>
          <div className="flex flex-col justify-start items-center w-full gap-2 h-[60%] ">
            <div className="bg-base-300 h-20 w-20 rounded-full mb-2" />
            <div className="flex justify-center gap-2 w-full">
              <div className="bg-base-300 h-4 w-[25%]" />
              <div className="bg-base-300 h-4 w-[35%]" />
            </div>
            <div className="flex justify-center gap-2 w-full ">
              <div className="bg-base-300 h-3 w-[45%]" />
              <div className="bg-base-300 h-3 w-[15%]" />
            </div>
            <div className="flex justify-center gap-1 w-full ">
              <div className="bg-base-300 h-3 w-[20%]" />
              <div className="bg-base-300 h-3 w-[20%]" />
              <div className="bg-base-300 h-3 w-[20%]" />
            </div>
          </div>
          <div className="flex justify-center items-center w-full gap-2">
            <div className="bg-base-300 h-3 w-[30%]" />
            <div className="bg-base-300 h-3 w-[30%]" />
          </div>
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
            onClick={() => setPhase(2)}
            disabled={hasEmptyFields}
            tabIndex={-1}
            className="btn-primary btn w-[43%] h-12"
          >
            Generate
          </button>
        </div>
      </form>
    )
  );
};

export default EmployeeIDView;
