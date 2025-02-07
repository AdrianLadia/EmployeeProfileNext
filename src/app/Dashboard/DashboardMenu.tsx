"use client";

import React from "react";

import { useAppContext } from "../GlobalContext";

const DashboardMenu = () => {
  const { serverRequests, loading, setLoading, userData, handleMemoTableModalClick, handleOffenseListClick } = useAppContext();

  const fetchOffenseList = async () => {
    setLoading(true);
    try {
      const res = await serverRequests.fetchOffenseList();
      if(res?.data){
        handleOffenseListClick(res.data);
      }else{
        console.error(res?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentMemo = async () => {
    setLoading(true);
    try {
      const res = await serverRequests.getAllRecentMemo(userData);
      if(res?.data){
        handleMemoTableModalClick(res.data);
      }else{
        console.error(res?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dropdown dropdown-bottom">
      <button
        className="btn btn-sm md:btn-md btn-square btn-outline border-2"
        title="Menu"
        tabIndex={0}
        role="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-5 md:size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
          />
        </svg>
      </button>

      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-lg z-[1] w-max shadow border-2 p-0 border-neutral font-semibold py-1 "
      >
        <li>
          <a onClick={fetchRecentMemo} title="Recent Memos">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${loading&&" loading text-info "} size-5`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Recent Memos
          </a>
          <a onClick={fetchOffenseList} title="Offense List">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`${loading&&" loading text-info "} size-5`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
            Offense List
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
