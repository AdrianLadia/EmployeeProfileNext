/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createContext, useState, useContext, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  ToastOptionsSchema,
  ConfirmationOptionsSchema,
  CardsSchema,
} from "../Schema";
import { Employee } from "../schemas/EmployeeSchema";
import { User, Roles } from "../schemas/UserSchema";
import { Memo, Offense } from "../schemas/MemoSchema";

import { StylesConfig } from "react-select";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import ServerRequests from "../api/ServerRequests";

// import firebaseConfig from '../api/firebase';
// import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
// import { getAuth } from "firebase/auth";

import { storage } from "../api/firebase";

// Define the properties of the context
interface AppContextProps {
  userData: User;
  setUserData: (data: User) => void;
  sampleText: string;
  cards: CardsSchema;
  pathname: string;
  toastOptions: ToastOptionsSchema;
  setToastOptions: (data: ToastOptionsSchema) => void;
  serverRequests: ServerRequests;
  confirmationOptions: ConfirmationOptionsSchema;
  setConfirmationOptions: (data: ConfirmationOptionsSchema) => void;
  handleConfirmation: (
    question: string,
    consequence: string,
    type: string
  ) => Promise<boolean>;
  router: ReturnType<typeof useRouter>;
  selectedEmployee: Employee;
  setSelectedEmployee: (data: Employee) => void;
  handleImageModalClick: (imageList: string[]) => void;
  imageListForModal: string[];
  setImageListForModal: (data: string[]) => void;
  memoForTableModal: Memo[];
  setMemoForTableModal: (data: Memo[]) => void;
  handleMemoTableModalClick: (data: Memo[]) => void;
  memoForPrintModal: Memo;
  setMemoForPrintModal: (data: Memo) => void;
  handleMemoPrintModalClick: (data: Memo) => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
  storage: ReturnType<typeof getStorage>;
  highlightText: (text: string) => JSX.Element[];
  setSearch: (data: string) => void;
  getOrdinal: (n: number) => string;
}

// Create the default context with proper types and default values
const AppContext = createContext<AppContextProps>({
  userData: {} as User,
  setUserData: () => {},
  sampleText: "",
  cards: {} as CardsSchema,
  pathname: "",
  toastOptions: { open: false, message: "", type: "", timer: 0 },
  setToastOptions: () => {},
  confirmationOptions: {
    open: false,
    question: "",
    consequence: "",
    type: "",
    onConfirm: () => {},
    onCancel: () => {},
  },
  setConfirmationOptions: () => {},
  serverRequests: new ServerRequests(),
  handleConfirmation: () => new Promise<boolean>(() => {}),
  router: {} as ReturnType<typeof useRouter>,
  selectedEmployee: {} as Employee,
  setSelectedEmployee: () => {},
  handleImageModalClick: () => {},
  imageListForModal: [],
  setImageListForModal: () => {},
  memoForTableModal: [] as Memo[],
  setMemoForTableModal: () => {},
  handleMemoTableModalClick: () => {},
  memoForPrintModal: {} as Memo,
  setMemoForPrintModal: () => {},
  handleMemoPrintModalClick: () => {},
  loading: false,
  setLoading: () => {},
  storage: {} as ReturnType<typeof getStorage>,
  highlightText: () => [],
  setSearch: () => {},
  getOrdinal: () => "",
});

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const serverRequests = new ServerRequests();

  const [environment, setEnvironment] = useState<string>("");
  // const app = initializeApp(firebaseConfig);

  // const storage = getStorage(app);
  // const auth = getAuth(app);
  const isTestEnv = process.env.NEXT_PUBLIC_CYPRESS_IS_TEST_ENV;

  // User state initialized with an empty user object
  const [userData, setUserData] = useState<User>({} as User);

  const [sampleText] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const cards = {
    Employee: [
      {
        path: "/Employee/Create",
        id: "create-employee",
        title: "Create Employee",
        description: "Create a new Employee Record",
        icon: (
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
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Employee/Update",
        id: "update-employee",
        title: "Update Employee",
        description: "Update an Employee",
        icon: (
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
              d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.867 19.125h.008v.008h-.008v-.008Z"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Employee/Delete",
        id: "delete-employee",
        title: "Delete Employee",
        description: "Delete an Employee",
        icon: (
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
              d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        ),
        roles: [],
      },
    ],
    Offense: [
      {
        path: "/Offense/Create",
        id: "create-offense",
        title: "Create Offense",
        description: "Create an Offense",
        icon: (
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Offense/Update",
        id: "update-offense",
        title: "Update Offense",
        description: "Update an Offense",
        icon: (
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Offense/Delete",
        id: "delete-offense",
        title: "Delete Offense",
        description: "Delete an Offense",
        icon: (
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        ),
        roles: [],
      },
    ],
    Memorandum: [
      {
        path: "/Memorandum/Create",
        id: "create-memorandum",
        title: "Create Memorandum",
        description: "Create a Memorandum",
        icon: (
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
              d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Memorandum/Submit",
        id: "submit-memorandum",
        title: "Submit Memorandum",
        description: "Submit a Memorandum",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
        ),
        roles: [],
      },
      {
        path: "/Memorandum/Delete",
        id: "delete-memorandum",
        title: "Delete Memorandum",
        description: "Delete a Memorandum",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13.5H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>
        ),
        roles: [],
      },
    ],
  };

  const [toastOptions, setToastOptions] = useState({
    open: false,
    message: "",
    type: "",
    timer: 0,
  });
  const [confirmationOptions, setConfirmationOptions] = useState({
    open: false,
    question: "",
    consequence: "",
    type: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(
    {} as Employee
  );

  const [imageListForModal, setImageListForModal] = useState<string[]>([]);

  const [memoForTableModal, setMemoForTableModal] = useState<Memo[]>([]);

  const [memoForPrintModal, setMemoForPrintModal] = useState<Memo>({} as Memo);

  useEffect(() => {
    serverRequests
      .getEnvironment()
      .then((res) => {
        setEnvironment(res.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
    setLoading(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as Session["user"] & {
        roles?: Roles;
        _id?: string;
        _version?: number;
        createdAt?: object;
        isApproved?: boolean;
      };

      const {
        name: displayName,
        email,
        image,
        roles,
        _id,
        _version,
        createdAt,
        isApproved,
      } = user;

      setUserData({
        image: image || "",
        _id: _id || "",
        _version: _version || 0,
        roles: roles || ({} as Roles),
        createdAt: createdAt ? createdAt.toString() : "",
        isApproved: isApproved || false,
        email: email || "",
        displayName: displayName || "",
      });

      setLoading(false);

      // setToastOptions({open:true, message: `Welcome ${displayName}`, type: 'success', timer: 5});
    }

    if (status === "unauthenticated" && isTestEnv === "false") { 
      router.push("/api/auth/signin");
    }
    if (status === "unauthenticated" && isTestEnv === "true") { 
      router.push("/");
      setLoading(false);
      // serverRequests.deleteAllDataInCollection('User')
      serverRequests.getUserForTesting().then((res) => {
        setUserData(res.data);
        console.log(res.data);
      });
    }
  }, [session, status, router, isTestEnv]);

  const handleConfirmation = (
    question: string,
    consequence: string,
    type: string
  ) => {
    return new Promise<boolean>((resolve) => {
      setConfirmationOptions({
        open: true,
        question: question,
        consequence: consequence,
        type: type,
        onConfirm: () => {
          setConfirmationOptions((prev) => ({
            ...prev,
            open: false,
            confirmed: true,
          }));
          setLoading(false);
          resolve(true);
        },
        onCancel: () => {
          setConfirmationOptions((prev) => ({
            ...prev,
            open: false,
            confirmed: false,
          }));
          setLoading(false);
          resolve(false);
        },
      });
    });
  };

  const handleImageModalClick = (imageList: string[]) => {
    const modal = document.getElementById("imageModal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
    setImageListForModal(imageList);
  };

  const handleMemoTableModalClick = (selectedEmployeeMemos: Memo[]) => {
    const modal = document.getElementById("EmployeeMemoModal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
    setMemoForTableModal(selectedEmployeeMemos);
  };

  const handleMemoPrintModalClick = (selectedMemo: Memo) => {
    const modal = document.getElementById("MemoPrintModal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
    setMemoForPrintModal(selectedMemo);
  };

  const highlightText = (text: string): JSX.Element[] => {
    if (!search) return [<span key="0">{text}</span>];
    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) => (
      <span
        key={index}
        className={
          part.toLowerCase() === search.toLowerCase() &&
          search.toLowerCase() !== " "
            ? "bg-error text-white font-semibold"
            : ""
        }
      >
        {part}
      </span>
    ));
  };

  const getOrdinal = (number: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    if (remainder >= 11 && remainder <= 13) {
      return `${number}th`;
    }

    return `${number}${suffixes[number % 10] || "th"}`;
  };

  // interface SelectStyle {
  //   control: (base: Record<string, unknown>) => unknown;
  //   singleValue: (base: Record<string, unknown>) => unknown;
  // }

  // const selectStyle: SelectStyle = {
  //   control: (base: Record<string, unknown>) => ({ ...base, height: '3rem', backgroundColor: "transparent", borderRadius: "10px" }),
  //   singleValue: (base: Record<string, unknown>) => ({
  //     ...base,
  //     color: 'invert',
  //   }),
  // }

  // Define the global values to be shared across the context
  const globals = {
    userData,
    setUserData,
    sampleText,
    cards,
    router,
    pathname,
    toastOptions,
    setToastOptions,
    serverRequests,
    confirmationOptions,
    setConfirmationOptions,
    handleConfirmation,
    selectedEmployee,
    setSelectedEmployee,
    handleImageModalClick,
    imageListForModal,
    setImageListForModal,
    memoForTableModal,
    setMemoForTableModal,
    handleMemoTableModalClick,
    memoForPrintModal,
    setMemoForPrintModal,
    handleMemoPrintModalClick,
    loading,
    setLoading,
    storage,
    highlightText,
    setSearch,
    getOrdinal,
  };

  return <AppContext.Provider value={globals}>{children}</AppContext.Provider>;
}

// Custom hook to use the AppContext in other components
export function useAppContext() {
  return useContext(AppContext);
}
