/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Id = string | null;
export type Firstname = string;
export type Lastname = string;
export type Address = string | null;
export type Phonenumber = string | null;
export type Photoofperson = string | null;
export type Resumephotoslist = string[] | null;
export type Biodataphotoslist = string[] | null;
export type Employeehouserulessignaturelist = string[] | null;
export type Email = string | null;
export type Datejoined = string | null;
export type Company = string | null;
export type Agency = string | null;
export type Isregular = boolean | null;
export type Companyrole = string | null;
export type Isojt = boolean | null;
export type Dailywage = number | null;
export type Isdeleted = boolean | null;
export type Employeesignature = string | null;
export type Version = number;

export interface Employee {
  _id?: Id;
  firstName: Firstname;
  lastName: Lastname;
  address: Address;
  phoneNumber: Phonenumber;
  photoOfPerson: Photoofperson;
  resumePhotosList: Resumephotoslist;
  biodataPhotosList: Biodataphotoslist;
  employeeHouseRulesSignatureList: Employeehouserulessignaturelist;
  email: Email;
  dateJoined: Datejoined;
  company: Company;
  agency: Agency;
  isRegular: Isregular;
  companyRole: Companyrole;
  isOJT: Isojt;
  dailyWage: Dailywage;
  isDeleted?: Isdeleted;
  employeeSignature?: Employeesignature;
  _version: Version;
}
