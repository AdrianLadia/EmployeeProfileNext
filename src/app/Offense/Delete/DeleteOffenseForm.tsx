"use client";

import React, { useState } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { Offense } from "@/app/schemas/OffenseSchema.ts";
import Select from "react-select";

interface DeleteOffenseFormProps {
  offenseList: Offense[];
  remedialActions: string[];
  confirmation?: boolean;
}

const DeleteOffenseForm: React.FC<DeleteOffenseFormProps> = ({
  offenseList,
  remedialActions,
  confirmation = true,
}) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    getOrdinal, 
    setLoading, loading, router
  } = useAppContext();

  const formRef = React.useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Offense>({} as Offense);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let confirmed = true;

    if (confirmation) {
      confirmed = await handleConfirmation(
        "Confirm Action?",
        `Delete ${formData?.title} Offense`,
        "error"
      );
    }

    setLoading(true);

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        const res = await serverRequests.deleteOffense(formData, userData);

        if (res.message) {
          setToastOptions({
            open: true,
            message: res.message,
            type: "success",
            timer: 5,
          });
          form.reset();
          setFormData({} as Offense);
        } else {
          setToastOptions({
            open: true,
            message: res.error,
            type: "error",
            timer: 5,
          });
        }
      } catch (e: unknown) {
        console.error("Error Deleting Offense:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
        router.refresh();
      }
    }
  };

  const selectStyle = {
    control: (base : unknown) => ({
      ...base || {},
      height: '3rem',
      backgroundColor: 'transparent',
      borderRadius: '10px',
    }),
    singleValue: (base : unknown) => ({
      ...base || {},
      color: 'inherit', 
    }),
};

  return (
    <form className="form-style" onSubmit={handleSubmit} ref={formRef}>
      <h2 className="font-semibold">Offense Deletion</h2>

      {/* Offense to Update */}
      {/* <div className='flex flex-col text-sm gap-2 '>Offense to Delete 
        <select className="select select-bordered w-full " id='select-offense' required
          value={formData?.title || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
              const selectedIndex = e.target.options.selectedIndex - 1
            setFormData(e.target.value=="null"?{} as Offense:offenseList[selectedIndex])
          }}  
        >
          <option disabled selected value={""}>Select Offense </option>
          {offenseList&&offenseList.map((Offense, index) => (
            <option key={index} value={Offense?.title || ""}>{Offense?.title}</option>
          ))}
          <option value="null">None</option>
        </select>
      </div> */}

      <Select styles={selectStyle}
        options={offenseList}
        placeholder="Select Offense" 
        getOptionLabel={(option) => `(${option.number}) - ${option.title}` || ""}
        value={formData?.title ? formData : null}
        isClearable
        onChange={(selectedOption) => {
          setFormData(selectedOption as Offense);
        }}
        id="select-memo"
      />

      {/* description */}
      <div className="flex flex-col text-sm gap-2 mt-2">
        Offense
        <div className="w-full flex flex-col md:flex-row justify-start gap-2">
          <input
            className="input input-bordered w-28 text-center "
            type="number"
            placeholder="Code"
            id="number"
            value={formData?.number || ""}
            onClick={(e) => e.currentTarget.blur()}
          ></input>
          <input
            className="input input-bordered w-full "
            type="text"
            placeholder="Offense Title"
            id="title"
            value={formData?.title || ""}
            onClick={(e) => e.currentTarget.blur()}
          ></input>
        </div>
        <textarea
          className="textarea textarea-bordered mt-1 min-h-[23vh]"
          placeholder="Offense Description"
          id="description"
          value={formData?.description}
          onClick={(e) => e.currentTarget.blur()}
        ></textarea>
      </div>

      {/* Remedial Actions */}
      <div className="flex flex-col text-sm gap-2 mt-4">
        Remedial Actions
        <div className=" flex flex-wrap gap-2 px-3" id="remedialActions">
          {remedialActions.map((action, index) => {
            const position = formData?.remedialActions?.indexOf(action) + 1;
            return (
              <div
                key={index}
                className={` indicator ${position && "tooltip tooltip-accent"}`}
                data-tip={`Action on ${getOrdinal(position)} Offense`}
              >
                <input
                  className=" flex join-item hyphens-auto h-max btn btn-sm btn-neutral "
                  checked={formData?.remedialActions?.includes(action) || false}
                  disabled={!formData?.remedialActions}
                  type="checkbox"
                  name="options"
                  value={action}
                  aria-label={action}
                  key={index}
                  id={action}
                />
                <span
                  className={`${
                    !position && "hidden"
                  } indicator-item badge-accent badge   `}
                >
                  {getOrdinal(position)}
                </span>
              </div>
            );
          })}
          {/* {remedialActions.map((action, index) => (
            <input 
                className={` ${formData?.remedialActions?.includes(action) ? ' ' : ' hover:brightness-150'}
                 join-item btn btn-sm font-normal tracking-tight btn-neutral `} checked={formData?.remedialActions?.includes(action)}
              disabled
              type="checkbox" name="options" value={action} aria-label={action} key={index}/>
          ))}  */}
        </div>
      </div>

      {/* submit */}
      <button
        className="btn bg-red-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={formData?.description ? false : true}
        id="delete-offense-btn"
      >
        {!loading ? "Delete" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default DeleteOffenseForm;
