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
  return !hasEmptyFields&&(
    <form
      className="carousel-item w-full flex relative flex-col items-center bg-slate-50/50"
      onSubmit={handleSubmit}
      id="phase2"
    >
      
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
  );
};

export default EmployeeIDView;
