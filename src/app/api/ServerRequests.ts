/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import Server from "./Server.ts";
import { UserObject, DataToUpdate } from "../Schema";
import { Memo } from "../schemas/MemoSchema.ts";
import { Offense } from "../schemas/OffenseSchema.ts";
import { Employee } from '../schemas/EmployeeSchema.ts'
import {User} from "../schemas/UserSchema.ts";
class ServerRequests extends Server {
  constructor( ) {
    super( );
  }

  async getIsDevEnvironment(): Promise<boolean | string> {
    try {
      const res: AxiosResponse<{ isDevEnvironment: boolean }> = await axios.get(`${this.url}/getIsDevEnvironment`);
      return res.data.isDevEnvironment;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async getEnvironment(): Promise<any> {
    try { 
      const res: AxiosResponse = await axios.get(`${this.url}/getEnvironment`);
      return res.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async deleteAllDataInCollection(collection: string): Promise<any> {
    try {
      const res: AxiosResponse = await axios.post(`${this.url}/deleteAllDataInCollection`, {
        collection,
      });
      return res.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async firebaseLogin(userObject: UserObject): Promise<any> { 
    try {
      const data = {
        userObject,
      };
      const jsonData = JSON.stringify(data);
      const res: AxiosResponse = await axios.post(`${this.url}/firebaseLogin`, jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data);
      } else {
        throw new Error(error.message || "An error occurred during login.");
      }
    }
  }

  async createEmployee(employee: Employee, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/createEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee: employee, userData: userObject }),
      }); 

      return await res.json();

    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async updateEmployee(employee: Employee, dataToUpdate: DataToUpdate, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/updateEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeData: employee, dataToUpdate, userData: userObject }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }  
  }

  async deleteEmployee(employee: Employee, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/deleteEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeData: employee, userData: userObject }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }  
    // try {
    //   const data = {
    //     employeeData: employee,
    //     userData: userObject,
    //   };
    //   const jsonData = JSON.stringify(data);
    //   const res: AxiosResponse = await axios.post(`${this.url}/deleteEmployee`, jsonData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   return res.data;
    // } catch (error: any) {
    //   if (error.response && error.response.data) {
    //     throw new Error(error.response.data);
    //   } else {
    //     throw new Error(error.message || "An error occurred during login.");
    //   }
    // }
  }

  async getUserForTesting(): Promise<any> {
    try {
      const res: AxiosResponse = await axios.get(`${this.url}/getUserForTesting`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async createOffense (offense: Offense, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/createOffense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offense: offense, userData: userObject }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
  }

  async updateOffense (offense: Offense, dataToUpdate: DataToUpdate, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/updateOffense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offenseData: offense, dataToUpdate, userData: userObject }),
        cache: 'no-store',
      }); 
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }  
  }

  async deleteOffense (offense: Offense, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/deleteOffense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offenseData: offense, userData: userObject }),
        cache: 'no-store',
      }); 
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }  
  }

  async createMemo (memo: Memo, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/createMemo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo: memo, userData: userObject }),
        cache: 'no-store',
      }); 
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }   
  }

  async submitMemo (memo: Memo, reason: string, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/submitMemo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoData: memo, reason, userData: userObject }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }   
    // try {
    //   const data = {
    //     memoData: memo,
    //     reason,
    //     userData: userObject,
    //   };
    //   const jsonData = JSON.stringify(data);
    //   const res: AxiosResponse = await axios.post(`${this.url}/submitMemo`, jsonData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   return res.data;
    // } catch (error: any) {
    //   if (error.response && error.response.data) {
    //     throw new Error(error.response.data);
    //   } else {
    //     throw new Error(error.message || "An error occurred during login.");
    //   }
    // }
  }

  async deleteMemo (memo: Memo, userObject: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/deleteMemo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoData: memo, userData: userObject }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async getMemoList(userObject: User, employeeId: string): Promise<any> {
    try {
      const res = await fetch(`${this.url}/getMemoList`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: userObject, employeeId }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }
  // async getAllMemoThatsNotSubmitted (userData: UserDataSchema): Promise<any> {
  //   try {
  //     const data = {
  //       userData: userData,
  //     };
  //     const jsonData = JSON.stringify(data);
  //     const res: AxiosResponse = await axios.post(`${this.url}/getAllMemoThatsNotSubmitted`, jsonData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     return res.data;
  //   } catch (error: any) {
  //     if (error.response && error.response.data) {
  //       throw new Error(error.response.data);
  //     } else {
  //       throw new Error(error.message || "An error occurred during login.");
  //     }
  //   }
  // }

  async getAllMemoThatsNotSubmitted(): Promise<any> {
    try {
      const res = await fetch(`${this.url}/readAllDataInCollection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: "Memo" }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
    // try {
    //   const data = {
    //     collection: "Memo",
    //   };
    //   const jsonData = JSON.stringify(data);
    //   const res = await axios.post(
    //     `${this.url}/readAllDataInCollection`,
    //     jsonData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   return res.data;
    // } catch (error: any) {
    //   return error.response?.data || error.message;
    // }
  } 

  async fetchEmployeeList(userData: User, page:number, limit:number, sort: {'keyToSort': string, 'sortOrder': unknown} | null): Promise<any> { 

    const data = {
      userData: userData,
      page: page,
      limit: limit,
      sort: sort
    };

    try{ 
      const res = await fetch(`${this.url}/fetchEmployeeList`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          cache: 'no-store',
        });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
  }  

  async fetchOffenseList(): Promise<any> {
    try {
      const res = await fetch(`${this.url}/readAllDataInCollection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: "Offense" }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
  }

  async getEmployeeForDashboardAction(userObject: User, page:number, sort: {'keyToSort': string, 'sortOrder': unknown} | null): Promise<any> {
    const data = {
      userData: userObject,
      page: page,
      sort: sort
    }
    try {
      const res = await fetch(`${this.url}/getEmployeeForDashboardAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  // async getEmployeeForDashboardAction(userObject: User): Promise<any> {
  //   try {
  //     const res = await fetch(`${this.url}/getEmployeeForDashboardAction`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ userData: userObject }),
  //       cache: 'no-store',
  //     });
  //     // return await res.json();
  //     const data = await res.json();
  //     if(data?.data){
  //       data.data = data.data.filter((employee: any) => employee.isDeleted === false);
  //       return data;
  //     }
  //   } catch (error:unknown) {
  //     return (error as Error).message;
  //   }
  // }

  async getEmployeeDetailsAction(userObject: User, employeeId: string): Promise<any> {
    try {
      const res = await fetch(`${this.url}/getEmployeeDetailsAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: userObject, employeeId }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async getRemedialActionForEmployeeMemoAction(userObject: User, employeeId: string, offenseId: string, offenseVersion: number): Promise<any> { 

    const data = {
      userData: userObject,
      employeeId: employeeId,
      offenseId: offenseId,
      offenseVersion: offenseVersion
    };

    try {
      const res = await fetch(`${this.url}/getRemedialActionForEmployeeMemoAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async getAllRoles () {
    try {
      const res = await fetch(`${this.url}/getAllRoles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }); 
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async addRoleToUser (userData: User, userToEdit: User, category: string, roleToAdd: string): Promise<any> {

    const data = {
      userData: userData,
      userDataToEdit: userToEdit,
      category: category,
      roleToAdd: roleToAdd
    }; 

    try {
      const res = await fetch(`${this.url}/addRoleToUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async removeRolefromUser (userData: User, userToEdit: User, category: string, roleToRemove: string): Promise<any> {

    const data = {
      userData: userData,
      userDataToEdit: userToEdit,
      category: category,
      roleToRemove: roleToRemove
    }; 

    try {
      const res = await fetch(`${this.url}/removeRolefromUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const res = await fetch(`${this.url}/readAllDataInCollection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: "User" }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
  }

  async getAllRecentMemo(userData: User): Promise<any> {
    try {
      const res = await fetch(`${this.url}/getAllRecentMemo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

  async updateEmployeeProfilePicture(employeeId: string, photoURL: string, userObject: User): Promise<any> {
    const data = {
      userData: userObject,
      employeeID: employeeId,
      picture: photoURL
    }

    try {
      const res = await fetch(`${this.url}/updateEmployeeProfilePicture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    }
  }

}

export default ServerRequests;
