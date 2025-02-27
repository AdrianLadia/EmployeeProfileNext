"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";

import "./globals.css";

import ContextProvider from "./GlobalContext/index";

import ProfileMenu from "./ProfileMenuComponents/ProfileMenu";
import Toast from "./toast";
import Confirmation from "./confirmation";

import ImageModal from "./Modals/ImageModal";
import VideoModal from "./Modals/VideoModal";
import EmployeeMemoTableModal from "./Modals/EmployeeMemoTableModal";
import MemoPrintModal from "./Modals/MemoPrintModal";
import EmployeeGalleryModal from "./Modals/EmployeeGalleryModal";

import OffenseTableModal from "./Offense/OffenseTableModal";

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
      <body className={` ${poppins.variable} overflow-x-clip pb-32 md:pb-0`}>
        <SessionProvider session={session}>
          <ContextProvider>
            <ProfileMenu />
            <LoadingOverlay />
            <Confirmation />
            {children}
            <ImageModal />
            <VideoModal/>
            <EmployeeGalleryModal/>
            <EmployeeMemoTableModal />
            <MemoPrintModal />
            <OffenseTableModal />
            <Toast />
          </ContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
