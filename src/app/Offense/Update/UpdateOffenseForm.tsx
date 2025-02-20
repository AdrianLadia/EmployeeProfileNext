"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { DataToUpdate } from "@/app/Schema";

import { Offense } from "@/app/schemas/OffenseSchema.ts";

import Select from "react-select";

interface UpdateOffenseFormProps {
  offenseList: Offense[];
  confirmation?: boolean;
}

const UpdateOffenseForm: React.FC<UpdateOffenseFormProps> = ({
  offenseList,
  confirmation = true,
}) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    router,
    getOrdinal,
    loading,
    setLoading,
  } = useAppContext();

  const formRef = React.useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Offense>({} as Offense);

  const [dataToUpdate, setDataToUpdate] = useState<DataToUpdate>(
    {} as DataToUpdate
  );

  const [newAction, setNewAction] = useState<string>("");

  const [remedialActions, setRemedialActions] = useState<string[]>([
    "Written-Reprimand",
    "Verbal Reprimand",
    "Verbal And Written Reprimand",
    "1 Day Suspension",
    "3 Days Suspension",
    "5 Days Suspension",
    "7 Days Suspension",
    "15 Days Suspension",
    "30 Days Suspension",
    "15 Days Suspension Or Management Discretion",
    "Dismissal",
    "Dismissal based on Offense Severity",
    "Written Reprimand / Suspension / Dismissal",
    "3 Days Suspension + 7 Days Gadget Confiscation",
    "7 Days Suspension + 15 Days Gadget Confiscation",
    "15 Days Suspension + 30 Days Gadget Confiscation",
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let confirmed = true;

    if (confirmation) {
      confirmed = await handleConfirmation(
        "Confirm Action?",
        `Update ${formData?.title} Offense`,
        ""
      );
    }

    setLoading(true);

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        if (formData.remedialActions.length === 0) {
          throw new Error("Remedial Actions must be selected");
        } else {
          const res = await serverRequests.updateOffense(
            formData,
            dataToUpdate,
            userData
          );

          if (res.message) {
            setToastOptions({
              open: true,
              message: res.message,
              type: "success",
              timer: 5,
            });

            form.reset();
            setFormData({} as Offense);

            router.refresh();

            formRef.current?.scrollIntoView({ behavior: "smooth" });
          } else {
            setToastOptions({
              open: true,
              message: res.error,
              type: "error",
              timer: 5,
            });
          }
        }
      } catch (e: unknown) {
        console.error("Error Updating Offense:", e);
        setToastOptions({
          open: true,
          message: (e as Error).message || "Error",
          type: "error",
          timer: 15,
        });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prevData) => {
      const data = {
        ...prevData,
        remedialActions: event.target.checked
          ? [...prevData.remedialActions, value]
          : prevData.remedialActions.filter((action) => action !== value),
      };
      setDataToUpdate((prev) => ({
        ...prev,
        remedialActions: data.remedialActions,
      }));
      return data;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => {
      const data = { ...prevData, [id]: value };
      return data;
    });
    setDataToUpdate((prev) => ({ ...prev, [id]: value }));
  };

  const selectStyle = {
    control: (base: unknown) => ({
      ...(base || {}),
      height: "3rem",
      backgroundColor: "transparent",
      borderRadius: "10px",
    }),
    singleValue: (base: unknown) => ({
      ...(base || {}),
      color: "inherit",
    }),
  };

  useEffect(() => {
    if (formData?.title) {
      const selectedRemedialActions = formData?.remedialActions || [];

      const mergedRemActs = new Set([
        ...remedialActions,
        ...selectedRemedialActions,
      ]);

      setRemedialActions(Array.from(mergedRemActs));
    }
  }, [formData?._id]);

  return (
    <form className="form-style" onSubmit={handleSubmit} ref={formRef}>
      <h2 className="font-semibold text-violet-500">Update Offense</h2>

      <Select
        styles={selectStyle}
        options={offenseList}
        placeholder="Select Offense"
        value={formData?.title ? formData : null}
        getOptionLabel={(option) =>
          `${option.title}` || ""
        }
        isClearable
        onChange={(selectedOption) => {
          setFormData(selectedOption as Offense);
        }}
        id="select-offense"
      />

      <div className="w-full border-b border-dashed"></div>

      <div className="flex flex-col text-sm gap-2 mt-2">
        Offense
        <input
          className="input input-bordered w-full "
          type="text"
          placeholder="Offense Title"
          id="title"
          required
          value={formData?.title || ""}
          disabled={!formData?.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange(e);
          }}
        ></input>
      </div>

      {/* description */}
      {/* <div className="flex flex-col text-sm gap-2 mt-2">
        Offense
        <div className="w-full flex flex-col md:flex-row justify-start gap-2">
          <input
            className="input input-bordered w-28 text-center "
            type="number"
            placeholder="Code"
            id="number"
            required
            value={formData?.number || ""}
            disabled={!formData?.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleInputChange(e);
            }}
          ></input>
          
        </div>
        <textarea
          className="textarea textarea-bordered mt-1 min-h-[30vh] "
          placeholder="Offense Description"
          id="description"
          required
          value={formData?.description}
          disabled={!formData?.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, description: e.target.value });
            setDataToUpdate((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          onFocus={(e) => {
            if (e.target.value === "") e.target.value = "• ";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const textarea = e.target as HTMLTextAreaElement;
              const value = textarea.value;
              textarea.value = value + "\n\n• ";
            }
          }}
        ></textarea>
      </div> */}

      {/* Remedial Actions */}
      <div className="flex flex-col text-sm gap-2 mt-4">
        <div className="w-full flex items-center justify-between px-3">
          <h3>Remedial Actions</h3>
          <button
            className={`${
              !formData?.remedialActions?.length && "hidden"
            } btn btn-error btn-xs`}
            onClick={(e) => {
              e.preventDefault();
              setFormData({ ...formData, remedialActions: [] });
              const checkboxes = document.querySelectorAll(
                'input[type="checkbox"]'
              ) as NodeListOf<HTMLInputElement>;
              checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
              });
            }}
          >
            Clear
          </button>
        </div>
        <div className=" flex flex-wrap gap-2 px-3" id="remedialActions">
          {remedialActions.map((action, index) => {
            const position = formData?.remedialActions?.indexOf(action) + 1;
            return (
              <div
                key={index}
                className={` indicator ${
                  position && "md:tooltip tooltip-accent"
                }`}
                data-tip={`Action on ${getOrdinal(position)} Offense`}
              >
                <input
                  className=" flex join-item hyphens-auto h-max btn btn-sm btn-neutral "
                  onChange={handleCheckboxChange}
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
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 px-3">
        <h3 className="w-full">Add Other Remedial Action</h3>
        <input
          className="input input-bordered grow"
          onChange={(e) => setNewAction(e.target.value)}
          value={newAction}
          type="text"
          disabled={!formData?.remedialActions}
          placeholder="New Action"
        />
        <input
          className="btn btn-neutral"
          type="button"
          value="Add" 
            disabled={!formData?.remedialActions || !newAction}
          onClick={() => {
            setRemedialActions((prev) => [...prev, newAction]);
            setNewAction("");
          }}
        />
      </div>

      {/* submit */}
      <button
        className="btn bg-violet-500 text-white w-full place-self-start my-6"
        type="submit"
        disabled={formData?.title ? false : true}
        id="update-offense-button"
      >
        {!loading ? "Update" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default UpdateOffenseForm;
