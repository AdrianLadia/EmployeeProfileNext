/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Id = string | null;
export type Remedialactions = string[];
export type Version = number;
export type Title = string;

export interface Offense {
  _id?: Id;
  remedialActions: Remedialactions;
  _version: Version;
  title: Title;
}
