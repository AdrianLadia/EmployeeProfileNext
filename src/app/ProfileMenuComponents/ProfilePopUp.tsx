"use client";

import React, { FC } from "react";

import { User } from "../schemas/UserSchema";

import { CardsSchema } from "../Schema";

import { signOut } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

import ThemeControl from "./ThemeControl";

import UserListButton from "./UserListButton";
import BackButton from "./BackButton";

export interface ProfilePopUpProps {
  userData: User;
  showMenu: boolean;
  cards: CardsSchema;
  pathname?: string;
}

const ProfilePopUp: FC<ProfilePopUpProps> = ({
  userData,
  showMenu,
  cards,
  pathname,
}) => {

  const handleSignOut = async () => {
    signOut();
  }; 

  return (
    <div onClick={(e) => e.stopPropagation()}
      className={` 
        ${showMenu ? " top-[55px] md:top-[75px] " : " hidden "} right-0 md:right-2
        absolute shadow-lg border backdrop-blur-lg bg-base-300 duration-300 transition-all
        w-[96vw] md:w-[330px] h-[83vh] md:max-h-[75vh] rounded-2xl z-50 
        flex flex-col justify-between border-info overflow-auto overscroll-contain
      `}
    >
      <BackButton />
      <UserListButton userData={userData} pathname={pathname||""}/>
      
      <div className="flex flex-wrap items-center justify-center rounded-t-2xl gap-2 ">
        <div className="w-full h-[2.3rem]"/>
        <Image
          className="rounded-box"
          src={userData?.image}
          width={72}
          height={72} 
          alt="userImage"
        />
        <h1 className="text-2xl font-semibold capitalize text-center max-w-full px-2">{userData?.displayName}</h1> 
        <p className="text-md select-all italic w-full text-center">{userData?.email}</p>
        <div className="w-full h-4"/> 
      </div> 

      <div className="flex flex-col justify-between px-6 bg-base-100 grow">
        <div className="mt-2 w-full ">
          {Object.keys(cards).map((key, index) => {
            return (
              <div key={index} className="mt-3 w-full ">
                <Link
                  href={`/${key}`}
                  className={`${
                    pathname === `/${key}`
                      ? " border-info text-info "
                      : " hover:text-info border-gray-300 "
                  } font-semibold btn btn-sm badge `}
                  id={`${key}-button`}
                >
                  {key}
                </Link>
                {cards[key].map((card, index) => {
                  return (
                    <Link
                      href={card.path}
                      key={index}
                      className={` ${
                        pathname === card.path
                          ? " border-info text-info"
                          : " hover:bg-base-200 hover:text-info border-gray-300 "
                      }
                        flex justify-start mt-1 btn w-full h-12 border bg-base-100 
                      `}
                      id={`${card.path}-button`}
                    >
                      <span className=" flex justify-center w-[20%]">
                        {card.icon}
                      </span>
                      <span className="w-[75%] text-start">{`${card.title}`}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

          <div className="mb-5"></div>

          <ThemeControl />
        </div>

        {/* logout */}
      </div>

      <div className="flex flex-col px-6 bg-base-100 pt-3 pb-6">
        <button
          className=" btn shrink-0 bg-base-300 w-full h-[60px] flex items-center justify-center gap-3 border hover:bg-error hover:text-white"
          onClick={() => {
            handleSignOut();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>

          <p className=" font-semibold">Sign out</p>
        </button>
        <div className="h-24 w-full md:hidden"/>
      </div>
    </div>
  );
};

export default ProfilePopUp;
