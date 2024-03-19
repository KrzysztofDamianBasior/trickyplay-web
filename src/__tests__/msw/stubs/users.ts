import { TPUserRepresentation } from "../../../shared/models/externalApiRepresentation/Resources";

export let usersCollectionStub: TPUserRepresentation[] = [
  {
    id: 1,
    name: "user",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 2,
    name: "admin",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "ADMIN",
  },
  {
    id: 3,
    name: "banned",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "BANNED",
  },
  {
    id: 4,
    name: "user4",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 5,
    name: "user5",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 6,
    name: "user6",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 7,
    name: "user7",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 8,
    name: "user8",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 9,
    name: "user9",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 10,
    name: "user10",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 11,
    name: "user11",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 12,
    name: "user12",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 13,
    name: "user13",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 14,
    name: "user14",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
  {
    id: 15,
    name: "user15",
    createdAt: "2023-10-15T20:30:38",
    updatedAt: "2023-10-15T20:30:38",
    role: "USER",
  },
];

export const passwords = [
  { userId: 1, password: "password" },
  { userId: 2, password: "password" },
  { userId: 3, password: "password" },
  { userId: 4, password: "password" },
  { userId: 5, password: "password" },
  { userId: 6, password: "password" },
  { userId: 7, password: "password" },
  { userId: 8, password: "password" },
  { userId: 9, password: "password" },
  { userId: 10, password: "password" },
  { userId: 11, password: "password" },
  { userId: 12, password: "password" },
  { userId: 13, password: "password" },
  { userId: 14, password: "password" },
  { userId: 15, password: "password" },
];

export let userStub: TPUserRepresentation = usersCollectionStub[0];

export let adminStub: TPUserRepresentation = usersCollectionStub[1];

export let bannedStub: TPUserRepresentation = usersCollectionStub[2];

let usersCollectionStubCopy: TPUserRepresentation[] = JSON.parse(
  JSON.stringify(usersCollectionStub)
);

export const resetUsersCollectionStub = () => {
  usersCollectionStub.length = 0; // This will clear the existing array by setting its length to 0
  usersCollectionStub.push(...usersCollectionStubCopy);
  usersCollectionStubCopy = JSON.parse(JSON.stringify(usersCollectionStub));
  userStub = usersCollectionStub[0];
  adminStub = usersCollectionStub[1];
  bannedStub = usersCollectionStub[2];
};
