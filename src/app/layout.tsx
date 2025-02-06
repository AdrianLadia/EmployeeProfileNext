"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";

import "./globals.css";

import ContextProvider from "./GlobalContext/index";

import ProfileMenu from "./ProfileMenuComponents/ProfileMenu";
import Toast from "./toast";
import Confirmation from "./confirmation";

import ImageModal from "./Modals/ImageModal";
import EmployeeMemoTableModal from "./Modals/EmployeeMemoTableModal";
import MemoPrintModal from "./Modals/MemoPrintModal";

// import OffenseTableModal from "./Offense/OffenseTableModal";

import LoadingOverlay from "./loadingOverlay.tsx";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: never;
}>) {
  return (
    <html lang="en">
      <body className={` ${poppins.variable} overflow-x-clip `}>
        <SessionProvider session={session}>
          <ContextProvider>
            <Confirmation />
            <ProfileMenu />
            <LoadingOverlay />
            {children}
            {/* <NavBar/> */}
            <ImageModal />
            <EmployeeMemoTableModal />
            <MemoPrintModal />
            {/* <OffenseTableModal /> */}
            <Toast />
          </ContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
