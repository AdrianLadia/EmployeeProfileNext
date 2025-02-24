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
      const res: AxiosResponse<{ isDevEnvironment: boolean }> = await axios.get(`${this.apiUrl}/getIsDevEnvironment`);
      return res.data.isDevEnvironment;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async getEnvironment(): Promise<any> {
    try { 
      const res: AxiosResponse = await axios.get(`${this.apiUrl}/getEnvironment`);
      return res.data;
    } catch (error: any) {
      return error.response?.data || error.message;
    }
  }

  async deleteAllDataInCollection(collection: string): Promise<any> {
    try {
      const res: AxiosResponse = await axios.post(`${this.apiUrl}/deleteAllDataInCollection`, {
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
      const res: AxiosResponse = await axios.post(`${this.apiUrl}/firebaseLogin`, jsonData, {
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
      const res = await fetch(`${this.apiUrl}/createEmployee`, {
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
      const res = await fetch(`${this.apiUrl}/updateEmployee`, {
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
      const res = await fetch(`${this.apiUrl}/deleteEmployee`, {
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
    //   const res: AxiosResponse = await axios.post(`${this.apiUrl}/deleteEmployee`, jsonData, {
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
      const res: AxiosResponse = await axios.get(`${this.apiUrl}/getUserForTesting`, {
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
      const res = await fetch(`${this.apiUrl}/createOffense`, {
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
      const res = await fetch(`${this.apiUrl}/updateOffense`, {
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
      const res = await fetch(`${this.apiUrl}/deleteOffense`, {
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
      const res = await fetch(`${this.apiUrl}/createMemo`, {
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
      const res = await fetch(`${this.apiUrl}/submitMemo`, {
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
    //   const res: AxiosResponse = await axios.post(`${this.apiUrl}/submitMemo`, jsonData, {
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
      const res = await fetch(`${this.apiUrl}/deleteMemo`, {
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
      const res = await fetch(`${this.apiUrl}/getMemoList`, {
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
  //     const res: AxiosResponse = await axios.post(`${this.apiUrl}/getAllMemoThatsNotSubmitted`, jsonData, {
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
      const res = await fetch(`${this.apiUrl}/readAllDataInCollection`, {
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
    //     `${this.apiUrl}/readAllDataInCollection`,
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
      const res = await fetch(`${this.apiUrl}/fetchEmployeeList`, {
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
      const res = await fetch(`${this.apiUrl}/readAllDataInCollection`, {
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
      const res = await fetch(`${this.apiUrl}/getEmployeeForDashboardAction`, {
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
  //     const res = await fetch(`${this.apiUrl}/getEmployeeForDashboardAction`, {
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
      const res = await fetch(`${this.apiUrl}/getEmployeeDetailsAction`, {
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
      const res = await fetch(`${this.apiUrl}/getRemedialActionForEmployeeMemoAction`, {
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
      const res = await fetch(`${this.apiUrl}/getAllRoles`, {
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
      const res = await fetch(`${this.apiUrl}/addRoleToUser`, {
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
      const res = await fetch(`${this.apiUrl}/removeRolefromUser`, {
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
      const res = await fetch(`${this.apiUrl}/readAllDataInCollection`, {
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
      const res = await fetch(`${this.apiUrl}/getAllRecentMemo`, {
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

  async updateEmployeeProfilePicture(employeeId: string, photoapiUrl: string, userObject: User): Promise<any> {
    const data = {
      userData: userObject,
      employeeID: employeeId,
      picture: photoapiUrl
    }

    try {
      const res = await fetch(`${this.apiUrl}/updateEmployeeProfilePicture`, {
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

  async updateapiUrlPhotoOfSignature(userData: User,  employeeId: string, signatureapiUrl: string): Promise<any> {
    const data = {
      userData: userData,
      employeeID: employeeId,
      signatureapiUrl: signatureapiUrl
    }

    try {
      const res = await fetch(`${this.apiUrl}/updateapiUrlPhotoOfSignature`, {
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

  async getAllEmployeeID(): Promise<any> {
    try {
      const res = await fetch(`${this.apiUrl}/readAllDataInCollection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: "EmployeeID" }),
        cache: 'no-store',
      });
      return await res.json();
    } catch (error:unknown) {
      return (error as Error).message;
    } 
  }

  async generateEmployeeID(userData: User,  employeeID: string): Promise<any> {
    const data = {
      userData: userData,
      employeeID: employeeID, 
    }
    try {
      const res = await fetch(`${this.apiUrl}/downloadIDServer`, {
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

  // async updateEmployeeID(userData: User,  employeeID: string): Promise<any> {
  //   const data = {
  //     userData: userData,
  //     employeeID: employeeID, 
  //   }
  //   try {
  //     const res = await fetch(`${this.downloadUrl}/downloadID`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(data),
  //       cache: 'no-store',
  //     });
  //     return await res.json();
  //   } catch (error:unknown) {
  //     return (error as Error).message;
  //   }
  // }

}

export default ServerRequests;
