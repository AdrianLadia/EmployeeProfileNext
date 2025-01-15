"use client";
 
import React from "react";

export interface Option {
  label: string;
  value: unknown;
}

interface SelectPlusProps {
  className?: string;
  options: Option[] | string[] | number[];
  defaultValue?: string| number;
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
    newValue: Option | string | number
  ) => void;
}

const SelectPlus: React.FC<SelectPlusProps> = ({
  className,
  defaultValue="",
  options,
  disabled,
  onChange,
}) => {
  const [toggle, setToggle] = React.useState(true);

  const [addedOption, setAddedOption] = React.useState("");

  const [finalOptions, setFinalOptions] = React.useState<unknown[]>(
    options || []
  );

  const [selectedOption, setSelectedOption] = React.useState<unknown | null>(
    null
  );

  const inputClassname = `${toggle ? " w-[90%] " : " w-[80%] "} h-full `;
  const buttonStyle = `btn btn-circle btn-xs tooltip tooltip-left grid place-items-center z-40 bg-base-300`; 

  React.useEffect(() => { 
    setSelectedOption(defaultValue);
  }, [ defaultValue ]);

  React.useEffect(() => {
    if (!options) return;
    setFinalOptions(options);
  }, [options]);

  const handleCancel = () => {
    handleToggle();
    setAddedOption("");
  };

  const handleSave = () => {
    setFinalOptions([...finalOptions, addedOption]);
    setAddedOption("");
    handleToggle();
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);

    const selectedIndex = e.target.options.selectedIndex - 1;

    let newValue;

    const chosenValue = finalOptions[selectedIndex] || null 

    if (typeof finalOptions[0] == typeof finalOptions[selectedIndex]) {
      newValue = chosenValue;
    } else if (typeof finalOptions[0] === "object") {
      let forNewValue = {};
      Object.keys(finalOptions[0] || {}).forEach((key) => {
        forNewValue = { ...forNewValue, [key]: chosenValue };
      });
      newValue = forNewValue;
    } 

    onChange(e, newValue as Option | string | number); 
  };

  const getOptionLabel = (option: Option | string | number) => {
    if (typeof option === "object" && "label" in option) {
      return option.label;
    }
    return option;
  };

  return (
    <div
      id="select-plus"
      className={`${className} ${disabled&&" input-disabled "} input input-bordered w-full p-0 m-0 flex items-center justify-evenly gap-3 pl-1 overflow-clip z-30`} 
    >
      {/*  */}
      <input
        className={`
          ${inputClassname} ${toggle ? " input " : " text-primary focus:text-primary"}
          input p-0 pl-1 input-ghost outline-none border-none
        `}
        type="text"
        placeholder="Enter Option"
        value={addedOption}
        id="company"
        onChange={(e) => {
          setAddedOption(e.target.value);
        }}
        hidden={toggle}
      />
      {/*  */}
      <select
        className={`${inputClassname} ${disabled? " bg-transparent " : " bg-base-100 "} h-[90%] outline-none `}
        hidden={!toggle}
        defaultValue={defaultValue}
        value={selectedOption?.toString() || ""} 
        onChange={(e) => handleChange(e)}
        id="company"
        disabled={disabled}
      >
        <option selected disabled value={""}>
          Select Option
        </option>
        {!!finalOptions.length &&
          finalOptions.map((option, index) => (
            <option
              key={index}
              id={index.toString()}
              value={getOptionLabel(option as Option | string | number)}
            >
              {getOptionLabel(option as Option | string | number)}
            </option>
          ))}
        {finalOptions.length && <option value={""}>None</option>}
      </select>

      <div
        className={` ${
          toggle ? " w-[10%] justify-center" : " w-[20%] justify-evenly"
        } flex `}
      >
        {/* add */}
        {toggle && (
          <button
            className={buttonStyle + "  "}
            onClick={() => handleToggle()}
            data-tip="Add Option"
            disabled={disabled}
            id="add-option"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        )}
        {/* save & cancel */}
        {!toggle && (
          // cancel
          <button
            className={buttonStyle + " btn- "}
            onClick={() => handleCancel()}
            data-tip="Cancel"
            disabled={disabled}
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {!toggle && (
          // save
          <button
            className={buttonStyle + " tooltip-primary "}
            disabled={disabled ? true : addedOption ? false : true}
            onClick={() => handleSave()}
            data-tip="Save"
            id= "save-option"
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
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SelectPlus;
