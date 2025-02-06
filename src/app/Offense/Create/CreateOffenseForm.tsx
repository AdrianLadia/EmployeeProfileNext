"use client";

import React, { useState } from "react";

import { useAppContext } from "@/app/GlobalContext";

import { Offense } from "@/app/schemas/OffenseSchema";

interface CreateOffenseFormProps {
  confirmation?: boolean;
}

const CreateOffenseForm: React.FC<CreateOffenseFormProps> = ({
  confirmation = true,
}) => {
  const {
    setToastOptions,
    serverRequests,
    userData,
    handleConfirmation,
    router,
    getOrdinal,
    setLoading,
    loading,
  } = useAppContext();

  const formRef = React.useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Offense>({} as Offense);

  const remedialActions = [
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
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let confirmed = true;

    if (confirmation) {
      confirmed = await handleConfirmation(
        "Confirm Action?",
        `Create ${formData?.title} Offense`,
        "success"
      );
    }

    setLoading(true);

    if (confirmed) {
      try {
        const form = e.target as HTMLFormElement;

        if (formData.remedialActions.length === 0) {
          throw new Error("Remedial Actions must be selected");
        } else {
          const res = await serverRequests.createOffense(formData, userData);

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
        console.error("Error creating Offense:", e);
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
    }else{
      setLoading(false)
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value; 
    setFormData((prevData) => {
      const remedialActions = prevData.remedialActions || [];
      return {
        ...prevData,
        remedialActions: event.target.checked
          ? [...remedialActions, value]
          : remedialActions.filter((action) => action !== value),
      };
    });
  };

  return (
    <form className="form-style" onSubmit={handleSubmit} ref={formRef}>
      <h2 className="font-semibold text-blue-500">Offense Creation</h2>

      <div className="flex flex-col text-sm gap-2 mt-2">
        Offense
        <div className="w-full flex flex-col md:flex-row justify-start gap-2">
          <input
            className="input input-bordered w-28 text-center "
            type="number"
            placeholder="Code"
            id="number"
            required
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, number: parseInt(e.target.value) });
            }}
          ></input>
          <input
            className="input input-bordered w-full "
            type="text"
            placeholder="Offense Title"
            id="title"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({ ...formData, title: e.target.value });
            }}
          ></input>
        </div>
        {/* description */}
        <textarea
          className="textarea textarea-bordered mt-1 min-h-[30vh]"
          placeholder="Offense Description"
          id="description"
          required
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData({ ...formData, description: e.target.value });
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
      </div>

      {/* Remedial Actions */}
      <div className="flex flex-col text-sm gap-4 mt-4 ">
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
        <div
          className=" flex flex-wrap justify-stretch gap-2 px-3 "
          id="remedialActions"
        >
          {remedialActions.map((action, index) => {
            const position = formData?.remedialActions?.indexOf(action) + 1;
            return (
              <div
                key={index}
                className={` indicator ${position && "md:tooltip tooltip-accent"}`}
                data-tip={`Action on ${getOrdinal(position)} Offense`}
              >
                <input
                  className=" flex join-item hyphens-auto h-max btn btn-sm btn-neutral "
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  name={action + index}
                  checked={formData?.remedialActions?.includes(action)}
                  value={action}
                  aria-label={action}
                  key={index}
                  id={action}
                />
                <span
                  className={`${
                    !position && "hidden"
                  } indicator-item badge badge-accent `}
                >
                  {getOrdinal(position)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* submit */}
      <button
        className="btn bg-blue-500 text-white w-full place-self-start my-6"
        type="submit"
        id="create-offense-button"
      >
        {!loading ? "Create" : <span className="animate-spin text-xl">C</span>}
      </button>
    </form>
  );
};

export default CreateOffenseForm;
