"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAppContext } from "./GlobalContext";

const Toast = () => {
  const { toastOptions, setToastOptions } = useAppContext();
  const [timer, setTimer] = useState(toastOptions?.timer);

  const toastRef = React.useRef<HTMLDivElement>(null);

  const closeToast = useCallback(() => {
    setToastOptions({ open: false, message: "", type: "", timer: 0 });
    setTimer(0);
  }, [setToastOptions]);

  const startTimer = useCallback(() => {
    const remainingTime = timer || 5;
    const decrement = remainingTime / 1000;

    try {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(interval);
            closeToast();
            return 0;
          }
          return prevTimer - decrement;
        });
      }, decrement);
    } catch (e) {
      console.error(e);
    }
  }, [timer]);

  useEffect(() => {
    if (toastOptions?.open) {
      setTimer(toastOptions?.timer);
      startTimer();
    }
  }, [toastOptions]);

  const getToastType = () => {
    switch (toastOptions?.type) {
      case "success":
        return ["alert-success", "progress-success", "tooltip-success"];
      case "error":
        return ["alert-error", "progress-error", "tooltip-error"];
      case "info":
        return ["alert-info", "progress-info", "tooltip-info"];
      case "warning":
        return ["alert-warning", "progress-warning", "tooltip-warning"];
      default:
        return [" ", " ", " "];
    }
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toastRef.current && !toastRef?.current?.contains(e.target as Node)) {
        if (!timer && toastOptions?.open) {
          closeToast();
        }
      }
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [toastOptions]);

  return (
    <div
      className={` flex items-center justify-center cursor-cell z-[1000]
                ${
                  toastOptions?.open
                    ? "toast-top toast-center lg:toast-start lg:toast-bottom"
                    : "hidden"
                } toast 
            `}
      key={toastOptions?.message}
      ref={toastRef}
    >
      <div
        className={`min-w-[98vw] md:min-w-max md:max-w-[20vw] alert text-wrap px-5 rounded ${
          getToastType()[0]
        }`}
        onClick={() => {
          closeToast();
          navigator.clipboard.writeText(toastOptions?.message);
        }}
        onMouseEnter={() => setTimer(50)}
        onMouseLeave={() => setTimer(toastOptions?.timer)}
        role="alert"
      >
        <span
          className={` text-start break-words md:tooltip tooltip-top ${
            getToastType()[2]
          } whitespace-pre-line`}
          data-tip="Copy and Close"
        >
          {toastOptions?.message}
        </span>
      </div>

      <progress
        className={`progress w-full ${getToastType()[1]} rounded-none -mt-1.5 `}
        value={(timer / toastOptions?.timer) * 100 || 0}
        max={100}
      />
    </div>
  );
};

export default Toast;
