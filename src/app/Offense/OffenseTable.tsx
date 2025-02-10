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
  const { setLoading, setSearch, getOrdinal, highlightText } = useAppContext();

  const [filteredOffenseList, setFilteredOffenseList] = React.useState<
    Offense[]
  >(offenseList as Offense[]);

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (search) {
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
    }else{
      setSearch("");
    }
  }, [search, offenseList]);

  // const wrapText = (text: string) => {
  //   const lines = text.split("\n").filter((line) => line.trim() !== "");

  //   const wrappedLines = lines.map((line) => `<span className="text-error">${line.trim()}</span>`);

  //   const result = wrappedLines.join("\n");

  //   return <div dangerouslySetInnerHTML={{ __html: result }} />;
  // };

  return (
    <table className={`w-full table ${!forPrint && "table-pin-rows "} h-full`}>
      <thead>
        <tr className=" bg-base-200 divide-x">
          <th className="w-[35%] p-2 text-center">Offense</th>
          <th className="w-[65%] p-2 " id="remedialActions">
            Remedial Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredOffenseList?.map((offense : Offense) => (
          <tr key={offense._id}>
            <td className="border text-center" id="violation">
              <div className=" ">
                {highlightText(`${offense?.title}`)}
              </div>
            </td>
            <td className="border px-4 ">
              <div className="flex flex-col justify-start h-max ">
                {offense?.remedialActions?.map((action, index) => (
                  <>
                    <div
                      key={action + index}
                      className=" "
                      data-tip={`${getOrdinal(index + 1)} Offense`}
                    >
                      {/* {wrapText(`${getOrdinal(index + 1)}: ${action}`)} */}
                      {highlightText(`${getOrdinal(index + 1)}: ${action}`)}
                    </div>
                    {index !== offense.remedialActions.length - 1 && <br />}
                  </>
                ))}
              </div>
            </td>
          </tr>
        ))}

        {!filteredOffenseList.length && (
          <tr>
            <td colSpan={4} className="text-center p-4">
              No results found
            </td>
          </tr>
        )}
      </tbody>
      {!forPrint && filteredOffenseList.length > 4 && (
        <tfoot>
          <tr className=" bg-base-200 divide-x ">
            <th className=" text-center p-2">Offense</th>
            <th className="  p-2  ">Remedial Actions</th>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default OffenseTable;
