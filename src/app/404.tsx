'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundContent() {
  const searchParams = useSearchParams(); // Now inside a separate client component
  const errorParam = searchParams.get("error");

  return <h1>404 - Page Not Found {errorParam ? `Error: ${errorParam}` : ""}</h1>;
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading 404...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}