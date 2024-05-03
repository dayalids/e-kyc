"use client";
import React from "react";
import useDarkMode from "@/hooks/useDarkMode";

const Loading = () => {
  const [isDark] = useDarkMode();
  return (
    <div className="flex flex-col items-center justify-center app_height">
      <div className="mb-3">
        <img
          src={
            isDark
              ? "/bbn-logo1.png"
              : "/bbn-logo1.png"
          }
          alt="Logo"
        />
      </div>

      <svg
        className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 
           h-12 w-12
         "
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

export default Loading;
