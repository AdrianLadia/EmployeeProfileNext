"use client";

import React from "react";

import Link from "next/link";

import { useAppContext } from "../GlobalContext";

interface BreadcrumbsProps {
  pathName?: string;
  fixed?: boolean;
  position?: { x: string; y: string };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  pathName,
  fixed,
  position = { x: "", y: "" },
}) => {
  const { pathname } = useAppContext();

  const [pathArray, setPathArray] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    if (pathName) {
      setPathArray(pathName.split("/").filter((path) => path !== ""));
    } else {
      setPathArray(pathname.split("/").filter((path) => path));
    }
  }, [pathName, pathname]);

  if (fixed && position?.x === "" && position?.y === "") {
    throw new Error("Position prop is required when fixed is true");
  }

  return (
    pathArray && (
      <div
        className={`
        ${fixed && `${position.x} ${position.y} fixed z-30`} 
        breadcrumbs text-sm h-16
        flex items-center overflow-hidden
      `}
      >
        <ul className="flex !justify-start !items-start text-start md:!flex-col 2xl:!flex-row">
          <li className=" hover:text-info ">
            <span className="hidden md:block">       </span><Link href="/" id="Home">Home</Link>
          </li>
          {pathArray?.map((path, index) => {
            const href = "/" + pathArray.slice(0, index + 1).join("/");
            const isLast = index === pathArray.length - 1;

            return (
              <li key={index}>
                {!isLast ? (
                  <Link className=" hover:text-info " href={href}>
                    {path.replace(/-/g, " ")}
                  </Link>
                ) : (
                  <span>{path.replace(/-/g, " ")}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default Breadcrumbs;
