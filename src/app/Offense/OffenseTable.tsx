"use client";

import React, { useEffect } from "react";

import { Offense } from "../schemas/OffenseSchema";

import { useAppContext } from "../GlobalContext";

import { useSearchParams } from "next/navigation"; 

interface OffenseTableProps {
  offenseList: Offense[];
  forPrint?: boolean;
}

const OffenseTable: React.FC<OffenseTableProps> = ({
  offenseList,
  forPrint = false,
}) => {
  const { setLoading, highlightText, setSearch, getOrdinal } = useAppContext();

  const [filteredOffenseList, setFilteredOffenseList] =
    React.useState<Offense[]>(offenseList);

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(search);
    const cleanedList = offenseList.map(({ _id, _version, ...rest }) => {
      if (_id && _version) {
        return rest;
      } else {
        return rest;
      }
    });
    const filteredList = cleanedList.filter((offense) =>
      JSON.stringify(offense)
        .toLowerCase()
        .includes(search?.toLowerCase() || "")
    );
    setFilteredOffenseList(filteredList as Offense[]);
    setLoading(false);
  }, [search]);

  const wrapText = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    const wrappedLines = lines.map(
      (line) => `<span>${line.trim()}</span><br/><br/>`
    );

    const result = wrappedLines.join("\n");

    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <table className={`w-full table ${!forPrint && "table-pin-rows "} h-full`}>
      <thead>
        {!forPrint ? (
          <tr className=" bg-base-200 divide-x">
            <th className=" p-2">Code</th>
            <th className=" p-2 ">Offense</th>
            <th className=" p-2 min-w-[80vw] md:min-w-[50vw] lg:min-w-[40vw] 2xl:min-w-[25vw]">
              Description
            </th>
            <th className=" p-2 ">Remedial Actions</th>
          </tr>
        ) : (
          <tr className=" bg-base-200 divide-x">
            {/* <th className=" p-2">Code</th> */}
            <th className=" p-2">Violation</th>
            <th className=" p-2 " id="remedialActions">Remedial Actions</th>
          </tr>
        )}
      </thead>
      <tbody>
        {filteredOffenseList?.map((offense) =>
          !forPrint ? (
            <tr className="  " key={offense._id}>
              <td className="border p-2 text-center font-bold">
                {highlightText(offense?.number?.toString())}
              </td>
              <td className="border p-2 max-w-max md:max-w-[20vw]">
                <div className="">{highlightText(offense?.title || "")}</div>
              </td>
              <td className="border whitespace-pre-line max-h-[60vh] md:max-h-[30vh] p-4">
                <div className="max-h-[55vh] md:max-h-[30vh] lg:max-h-max md:overscroll-contain overflow-y-auto bg-base-300 rounded-box p-4 whitespace-pre-line">
                  {highlightText(offense.description)}
                </div>
              </td>
              <td className="border px-4 ">
                <div className="flex flex-wrap min-w-[50vw] md:min-w-[100%] gap-2 ">
                  {offense?.remedialActions?.map((action, index) => (
                    <div
                      key={action + index}
                      className=" flex text-start px-2 py-1 rounded-box bg-neutral text-neutral-content shadow-base-content tooltip tooltip-accent"
                      data-tip={`${getOrdinal(index + 1)} Offense`}
                    >
                      <span>{highlightText(action)}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ) : (
            <tr key={offense._id}>
              {/* <td className="border p-2 text-center font-bold" id="code">
                {offense?.number?.toString()}
              </td> */}
              <td id="violation">
                <div className="p-1 text-xl" id="offenseTitle">
                ({offense?.number?.toString()}) {offense?.title}
                </div>
                <div className="p-1  ">
                  {wrapText(offense?.description || "")}
                </div>
              </td>
              <td className="border px-4 " >
                <div className="flex flex-col justify-evenly h-full gap-2 ">
                  {offense?.remedialActions?.map((action, index) => (
                    <div
                      key={action + index}
                      className=" flex"
                      data-tip={`${getOrdinal(index + 1)} Offense`}
                    >
                      {wrapText(`${getOrdinal(index + 1)}: ${action}`)}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          )
        )}
        {!filteredOffenseList.length && (
          <tr>
            <td colSpan={4} className="text-center p-4">
              No results found
            </td>
          </tr>
        )}
      </tbody>
      {!forPrint && (
        <tfoot>
          <tr className=" bg-base-200 divide-x ">
            <th className="  p-2">Code</th>
            <th className="  p-2">Violation</th>
            <th className="  p-2  ">Description</th>
            <th className="  p-2  ">Remedial Actions</th>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default OffenseTable;
