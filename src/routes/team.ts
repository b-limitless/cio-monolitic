import {
  BadRequestError,
  currentUser,
  hasPermissions,
  requireAuth,
  validateRequest,
} from "@pasal/common";
import logger from "@pasal/common/build/logger";
import express, { Request, Response } from "express";
import { TeamBodyRequest } from "../body-request/Team.body-request";
import { mailerEmail } from "../config/email";
import { sendMail } from "../mailar";
import { messages } from "../messages";
import { UserService } from "../services/User.service";
import { readFile } from "../utils/readFile";
import { checkPermissionAllSet } from "./utils";
import { User } from "../models/user";
import { limit } from "../config/email";
import { Permission } from "../models/permissions";
import mongoose from "mongoose";

// Rememer you are updating full resource therefore use PUT method rather then PATCH
// PATCH is used when there is partial modification of resource
// Update api and test and front end files 

export const mockUsers = [
  {
    id: { $oid: "653e3045fc13ae0b66c76d68" },
    firstName: "Geralda",
    lastName: "Searston",
    fullName: "Geralda Searston",
    email: "gsearston0@bbc.co.uk",
    role: "admin",
    phoneNumber: "718-805-7161",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d69" },
    firstName: "Peggy",
    lastName: "Brizland",
    fullName: "Peggy Brizland",
    email: "pbrizland1@usgs.gov",
    role: "admin",
    phoneNumber: "484-267-6984",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6a" },
    firstName: "Stuart",
    lastName: "Levick",
    fullName: "Stuart Levick",
    email: "slevick2@twitpic.com",
    role: "admin",
    phoneNumber: "370-331-1391",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6b" },
    firstName: "Obadias",
    lastName: "Jeannel",
    fullName: "Obadias Jeannel",
    email: "ojeannel3@people.com.cn",
    role: "admin",
    phoneNumber: "105-195-0719",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6c" },
    firstName: "Karel",
    lastName: "Cuseck",
    fullName: "Karel Cuseck",
    email: "kcuseck4@hexun.com",
    role: "developer",
    phoneNumber: "483-530-4562",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6d" },
    firstName: "Hollie",
    lastName: "O'Carran",
    fullName: "Hollie O'Carran",
    email: "hocarran5@nhs.uk",
    role: "marketing",
    phoneNumber: "186-393-7553",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6e" },
    firstName: "Tandi",
    lastName: "Rubinovici",
    fullName: "Tandi Rubinovici",
    email: "trubinovici6@php.net",
    role: "developer",
    phoneNumber: "406-435-8996",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d6f" },
    firstName: "Karlotte",
    lastName: "Sigart",
    fullName: "Karlotte Sigart",
    email: "ksigart7@xing.com",
    role: "admin",
    phoneNumber: "671-665-5771",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d70" },
    firstName: "Ilka",
    lastName: "Yakolev",
    fullName: "Ilka Yakolev",
    email: "iyakolev8@dagondesign.com",
    role: "sales",
    phoneNumber: "719-838-9374",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d71" },
    firstName: "Washington",
    lastName: "McGebenay",
    fullName: "Washington McGebenay",
    email: "wmcgebenay9@g.co",
    role: "admin",
    phoneNumber: "354-520-3705",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d72" },
    firstName: "Marlo",
    lastName: "Hamlen",
    fullName: "Marlo Hamlen",
    email: "mhamlena@weebly.com",
    role: "sales",
    phoneNumber: "699-870-7191",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d73" },
    firstName: "Anna",
    lastName: "Laycock",
    fullName: "Anna Laycock",
    email: "alaycockb@xrea.com",
    role: "marketing",
    phoneNumber: "875-194-3972",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d74" },
    firstName: "Galven",
    lastName: "Clymer",
    fullName: "Galven Clymer",
    email: "gclymerc@alexa.com",
    role: "marketing",
    phoneNumber: "560-188-5016",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d75" },
    firstName: "Virgie",
    lastName: "Gerrill",
    fullName: "Virgie Gerrill",
    email: "vgerrilld@yale.edu",
    role: "marketing",
    phoneNumber: "301-739-7358",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d76" },
    firstName: "Lynette",
    lastName: "Kilbee",
    fullName: "Lynette Kilbee",
    email: "lkilbeee@cisco.com",
    role: "admin",
    phoneNumber: "762-621-5913",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d77" },
    firstName: "Otho",
    lastName: "O' Clovan",
    fullName: "Otho O' Clovan",
    email: "oof@list-manage.com",
    role: "sales",
    phoneNumber: "163-579-0252",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d78" },
    firstName: "Kamila",
    lastName: "Krystof",
    fullName: "Kamila Krystof",
    email: "kkrystofg@umich.edu",
    role: "marketing",
    phoneNumber: "667-899-2990",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d79" },
    firstName: "Kesley",
    lastName: "Dudding",
    fullName: "Kesley Dudding",
    email: "kduddingh@sourceforge.net",
    role: "marketing",
    phoneNumber: "176-211-7810",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7a" },
    firstName: "Emmanuel",
    lastName: "Ricca",
    fullName: "Emmanuel Ricca",
    email: "ericcai@apache.org",
    role: "developer",
    phoneNumber: "692-335-7998",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7b" },
    firstName: "Maynard",
    lastName: "Polland",
    fullName: "Maynard Polland",
    email: "mpollandj@google.co.jp",
    role: "sales",
    phoneNumber: "365-721-8396",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7c" },
    firstName: "Keefe",
    lastName: "Tuma",
    fullName: "Keefe Tuma",
    email: "ktumak@uol.com.br",
    role: "developer",
    phoneNumber: "330-496-0986",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7d" },
    firstName: "Ahmed",
    lastName: "Scarlon",
    fullName: "Ahmed Scarlon",
    email: "ascarlonl@digg.com",
    role: "marketing",
    phoneNumber: "746-592-6660",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7e" },
    firstName: "Ruthy",
    lastName: "Vant",
    fullName: "Ruthy Vant",
    email: "rvantm@ehow.com",
    role: "developer",
    phoneNumber: "260-688-0359",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d7f" },
    firstName: "Harriott",
    lastName: "Feavearyear",
    fullName: "Harriott Feavearyear",
    email: "hfeavearyearn@jalbum.net",
    role: "admin",
    phoneNumber: "912-631-9161",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d80" },
    firstName: "Berton",
    lastName: "Blodget",
    fullName: "Berton Blodget",
    email: "bblodgeto@miibeian.gov.cn",
    role: "sales",
    phoneNumber: "960-840-5391",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d81" },
    firstName: "Joelle",
    lastName: "Patty",
    fullName: "Joelle Patty",
    email: "jpattyp@facebook.com",
    role: "admin",
    phoneNumber: "695-280-5485",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d82" },
    firstName: "Jolie",
    lastName: "Lambell",
    fullName: "Jolie Lambell",
    email: "jlambellq@skype.com",
    role: "developer",
    phoneNumber: "295-337-7852",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d83" },
    firstName: "Heda",
    lastName: "Weight",
    fullName: "Heda Weight",
    email: "hweightr@qq.com",
    role: "sales",
    phoneNumber: "783-968-3588",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d84" },
    firstName: "Charlotte",
    lastName: "Chasles",
    fullName: "Charlotte Chasles",
    email: "cchasless@loc.gov",
    role: "developer",
    phoneNumber: "799-520-6547",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d85" },
    firstName: "Pauletta",
    lastName: "Billingsly",
    fullName: "Pauletta Billingsly",
    email: "pbillingslyt@cbc.ca",
    role: "marketing",
    phoneNumber: "761-498-8967",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d86" },
    firstName: "Veronike",
    lastName: "Searle",
    fullName: "Veronike Searle",
    email: "vsearleu@friendfeed.com",
    role: "marketing",
    phoneNumber: "781-860-2181",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d87" },
    firstName: "Gianni",
    lastName: "Anthony",
    fullName: "Gianni Anthony",
    email: "ganthonyv@rakuten.co.jp",
    role: "developer",
    phoneNumber: "662-527-3182",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d88" },
    firstName: "Lyell",
    lastName: "Dredge",
    fullName: "Lyell Dredge",
    email: "ldredgew@harvard.edu",
    role: "admin",
    phoneNumber: "698-381-9996",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d89" },
    firstName: "Elsie",
    lastName: "Nutty",
    fullName: "Elsie Nutty",
    email: "enuttyx@deliciousdays.com",
    role: "sales",
    phoneNumber: "447-770-7554",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8a" },
    firstName: "Clywd",
    lastName: "Rushford",
    fullName: "Clywd Rushford",
    email: "crushfordy@stumbleupon.com",
    role: "marketing",
    phoneNumber: "149-508-4843",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8b" },
    firstName: "Sophia",
    lastName: "Obert",
    fullName: "Sophia Obert",
    email: "sobertz@cloudflare.com",
    role: "marketing",
    phoneNumber: "976-196-6225",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8c" },
    firstName: "Sibbie",
    lastName: "Coon",
    fullName: "Sibbie Coon",
    email: "scoon10@cocolog-nifty.com",
    role: "admin",
    phoneNumber: "172-563-2145",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8d" },
    firstName: "Kile",
    lastName: "Clemmett",
    fullName: "Kile Clemmett",
    email: "kclemmett11@digg.com",
    role: "developer",
    phoneNumber: "545-505-1478",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8e" },
    firstName: "Hamlin",
    lastName: "Matuska",
    fullName: "Hamlin Matuska",
    email: "hmatuska12@mail.ru",
    role: "admin",
    phoneNumber: "873-995-5450",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d8f" },
    firstName: "Salmon",
    lastName: "Plaster",
    fullName: "Salmon Plaster",
    email: "splaster13@fotki.com",
    role: "marketing",
    phoneNumber: "555-920-9510",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d90" },
    firstName: "Merridie",
    lastName: "Kneath",
    fullName: "Merridie Kneath",
    email: "mkneath14@123-reg.co.uk",
    role: "sales",
    phoneNumber: "951-233-5691",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d91" },
    firstName: "Dare",
    lastName: "Crackel",
    fullName: "Dare Crackel",
    email: "dcrackel15@fda.gov",
    role: "admin",
    phoneNumber: "449-571-8974",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d92" },
    firstName: "Gilberte",
    lastName: "Tittletross",
    fullName: "Gilberte Tittletross",
    email: "gtittletross16@reddit.com",
    role: "marketing",
    phoneNumber: "409-303-2069",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d93" },
    firstName: "Raquela",
    lastName: "Hardiker",
    fullName: "Raquela Hardiker",
    email: "rhardiker17@noaa.gov",
    role: "marketing",
    phoneNumber: "393-607-3850",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d94" },
    firstName: "Margie",
    lastName: "Waite",
    fullName: "Margie Waite",
    email: "mwaite18@hexun.com",
    role: "marketing",
    phoneNumber: "131-542-9385",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d95" },
    firstName: "Muffin",
    lastName: "Jeynes",
    fullName: "Muffin Jeynes",
    email: "mjeynes19@rambler.ru",
    role: "marketing",
    phoneNumber: "177-540-9278",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d96" },
    firstName: "Adrienne",
    lastName: "Boc",
    fullName: "Adrienne Boc",
    email: "aboc1a@fc2.com",
    role: "developer",
    phoneNumber: "332-749-6791",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d97" },
    firstName: "Bren",
    lastName: "D'Aubney",
    fullName: "Bren D'Aubney",
    email: "bdaubney1b@economist.com",
    role: "marketing",
    phoneNumber: "897-847-9185",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d98" },
    firstName: "Astra",
    lastName: "Deedes",
    fullName: "Astra Deedes",
    email: "adeedes1c@cocolog-nifty.com",
    role: "admin",
    phoneNumber: "221-826-2679",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d99" },
    firstName: "Berkeley",
    lastName: "Pannett",
    fullName: "Berkeley Pannett",
    email: "bpannett1d@msu.edu",
    role: "marketing",
    phoneNumber: "322-701-3707",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9a" },
    firstName: "Bryna",
    lastName: "Hackin",
    fullName: "Bryna Hackin",
    email: "bhackin1e@storify.com",
    role: "marketing",
    phoneNumber: "361-398-4217",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9b" },
    firstName: "Dilly",
    lastName: "Northrop",
    fullName: "Dilly Northrop",
    email: "dnorthrop1f@qq.com",
    role: "sales",
    phoneNumber: "221-313-9575",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9c" },
    firstName: "Fredrika",
    lastName: "Plaice",
    fullName: "Fredrika Plaice",
    email: "fplaice1g@thetimes.co.uk",
    role: "marketing",
    phoneNumber: "135-731-1608",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9d" },
    firstName: "Teressa",
    lastName: "McKinnon",
    fullName: "Teressa McKinnon",
    email: "tmckinnon1h@cloudflare.com",
    role: "developer",
    phoneNumber: "293-811-5392",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9e" },
    firstName: "Melody",
    lastName: "Fildery",
    fullName: "Melody Fildery",
    email: "mfildery1i@ycombinator.com",
    role: "admin",
    phoneNumber: "127-145-1900",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76d9f" },
    firstName: "Taylor",
    lastName: "Bitterton",
    fullName: "Taylor Bitterton",
    email: "tbitterton1j@facebook.com",
    role: "developer",
    phoneNumber: "636-639-6887",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da0" },
    firstName: "Goddart",
    lastName: "Hewins",
    fullName: "Goddart Hewins",
    email: "ghewins1k@51.la",
    role: "marketing",
    phoneNumber: "979-761-5987",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da1" },
    firstName: "Livvie",
    lastName: "Clayden",
    fullName: "Livvie Clayden",
    email: "lclayden1l@opensource.org",
    role: "marketing",
    phoneNumber: "805-300-4815",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da2" },
    firstName: "Gwendolin",
    lastName: "Beavers",
    fullName: "Gwendolin Beavers",
    email: "gbeavers1m@histats.com",
    role: "admin",
    phoneNumber: "370-983-6006",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da3" },
    firstName: "Sully",
    lastName: "Raynard",
    fullName: "Sully Raynard",
    email: "sraynard1n@tamu.edu",
    role: "sales",
    phoneNumber: "175-924-9044",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da4" },
    firstName: "Alikee",
    lastName: "Burges",
    fullName: "Alikee Burges",
    email: "aburges1o@nsw.gov.au",
    role: "admin",
    phoneNumber: "628-237-4245",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da5" },
    firstName: "Boote",
    lastName: "Colborn",
    fullName: "Boote Colborn",
    email: "bcolborn1p@sciencedaily.com",
    role: "admin",
    phoneNumber: "874-733-1859",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da6" },
    firstName: "Anett",
    lastName: "Remmer",
    fullName: "Anett Remmer",
    email: "aremmer1q@usa.gov",
    role: "admin",
    phoneNumber: "300-377-4873",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da7" },
    firstName: "Petrina",
    lastName: "Effaunt",
    fullName: "Petrina Effaunt",
    email: "peffaunt1r@utexas.edu",
    role: "marketing",
    phoneNumber: "974-279-9265",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da8" },
    firstName: "Milena",
    lastName: "Sijmons",
    fullName: "Milena Sijmons",
    email: "msijmons1s@joomla.org",
    role: "developer",
    phoneNumber: "157-153-8773",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76da9" },
    firstName: "Trudy",
    lastName: "Ackwood",
    fullName: "Trudy Ackwood",
    email: "tackwood1t@ibm.com",
    role: "developer",
    phoneNumber: "329-484-9506",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76daa" },
    firstName: "Penrod",
    lastName: "Trowler",
    fullName: "Penrod Trowler",
    email: "ptrowler1u@yandex.ru",
    role: "developer",
    phoneNumber: "578-215-9187",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dab" },
    firstName: "Merwyn",
    lastName: "Sissens",
    fullName: "Merwyn Sissens",
    email: "msissens1v@flavors.me",
    role: "admin",
    phoneNumber: "243-355-8804",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dac" },
    firstName: "Nicolina",
    lastName: "Eberz",
    fullName: "Nicolina Eberz",
    email: "neberz1w@wix.com",
    role: "admin",
    phoneNumber: "851-391-3068",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dad" },
    firstName: "Torr",
    lastName: "Stook",
    fullName: "Torr Stook",
    email: "tstook1x@netscape.com",
    role: "marketing",
    phoneNumber: "942-804-6348",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dae" },
    firstName: "Libbi",
    lastName: "Karpf",
    fullName: "Libbi Karpf",
    email: "lkarpf1y@g.co",
    role: "developer",
    phoneNumber: "954-586-6661",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76daf" },
    firstName: "Devina",
    lastName: "Robbings",
    fullName: "Devina Robbings",
    email: "drobbings1z@cafepress.com",
    role: "marketing",
    phoneNumber: "695-891-0315",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db0" },
    firstName: "Alena",
    lastName: "Heinzler",
    fullName: "Alena Heinzler",
    email: "aheinzler20@plala.or.jp",
    role: "sales",
    phoneNumber: "203-659-7635",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db1" },
    firstName: "Lauralee",
    lastName: "Ramshay",
    fullName: "Lauralee Ramshay",
    email: "lramshay21@cisco.com",
    role: "admin",
    phoneNumber: "369-856-2418",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db2" },
    firstName: "Leonardo",
    lastName: "Manicom",
    fullName: "Leonardo Manicom",
    email: "lmanicom22@mlb.com",
    role: "developer",
    phoneNumber: "275-699-3235",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db3" },
    firstName: "Kim",
    lastName: "Botly",
    fullName: "Kim Botly",
    email: "kbotly23@twitpic.com",
    role: "marketing",
    phoneNumber: "829-134-2253",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db4" },
    firstName: "Graeme",
    lastName: "Roj",
    fullName: "Graeme Roj",
    email: "groj24@foxnews.com",
    role: "admin",
    phoneNumber: "553-159-2637",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db5" },
    firstName: "Zandra",
    lastName: "Benninck",
    fullName: "Zandra Benninck",
    email: "zbenninck25@netscape.com",
    role: "developer",
    phoneNumber: "416-838-7247",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db6" },
    firstName: "Karia",
    lastName: "Minger",
    fullName: "Karia Minger",
    email: "kminger26@shareasale.com",
    role: "sales",
    phoneNumber: "779-129-1950",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db7" },
    firstName: "Bayard",
    lastName: "Mulrooney",
    fullName: "Bayard Mulrooney",
    email: "bmulrooney27@chron.com",
    role: "developer",
    phoneNumber: "990-121-2612",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db8" },
    firstName: "Ludvig",
    lastName: "Wharram",
    fullName: "Ludvig Wharram",
    email: "lwharram28@msn.com",
    role: "marketing",
    phoneNumber: "811-389-0000",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76db9" },
    firstName: "Bronny",
    lastName: "Delacroux",
    fullName: "Bronny Delacroux",
    email: "bdelacroux29@dmoz.org",
    role: "admin",
    phoneNumber: "166-288-2177",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dba" },
    firstName: "Allister",
    lastName: "Fryd",
    fullName: "Allister Fryd",
    email: "afryd2a@amazon.com",
    role: "marketing",
    phoneNumber: "437-249-3521",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dbb" },
    firstName: "Berthe",
    lastName: "Tym",
    fullName: "Berthe Tym",
    email: "btym2b@istockphoto.com",
    role: "sales",
    phoneNumber: "782-122-9444",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dbc" },
    firstName: "Magdalen",
    lastName: "Petr",
    fullName: "Magdalen Petr",
    email: "mpetr2c@surveymonkey.com",
    role: "sales",
    phoneNumber: "210-154-1870",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dbd" },
    firstName: "Gan",
    lastName: "Shinner",
    fullName: "Gan Shinner",
    email: "gshinner2d@mysql.com",
    role: "admin",
    phoneNumber: "627-230-9743",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dbe" },
    firstName: "Ellerey",
    lastName: "Dix",
    fullName: "Ellerey Dix",
    email: "edix2e@miibeian.gov.cn",
    role: "marketing",
    phoneNumber: "264-208-0765",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dbf" },
    firstName: "Kenn",
    lastName: "O'Deegan",
    fullName: "Kenn O'Deegan",
    email: "kodeegan2f@chronoengine.com",
    role: "sales",
    phoneNumber: "131-458-8777",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc0" },
    firstName: "Sylvia",
    lastName: "Oddey",
    fullName: "Sylvia Oddey",
    email: "soddey2g@google.ru",
    role: "sales",
    phoneNumber: "750-114-8426",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc1" },
    firstName: "Jenilee",
    lastName: "Mowsdale",
    fullName: "Jenilee Mowsdale",
    email: "jmowsdale2h@telegraph.co.uk",
    role: "developer",
    phoneNumber: "340-457-8556",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc2" },
    firstName: "Noella",
    lastName: "Chaffer",
    fullName: "Noella Chaffer",
    email: "nchaffer2i@i2i.jp",
    role: "admin",
    phoneNumber: "845-624-0057",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc3" },
    firstName: "Cy",
    lastName: "Maroney",
    fullName: "Cy Maroney",
    email: "cmaroney2j@diigo.com",
    role: "sales",
    phoneNumber: "276-511-1697",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc4" },
    firstName: "Delphinia",
    lastName: "Plumer",
    fullName: "Delphinia Plumer",
    email: "dplumer2k@delicious.com",
    role: "developer",
    phoneNumber: "562-537-5920",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc5" },
    firstName: "Louella",
    lastName: "Tomaszek",
    fullName: "Louella Tomaszek",
    email: "ltomaszek2l@sun.com",
    role: "marketing",
    phoneNumber: "273-397-5446",
    status: "active",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc6" },
    firstName: "Christalle",
    lastName: "Kitcatt",
    fullName: "Christalle Kitcatt",
    email: "ckitcatt2m@msu.edu",
    role: "sales",
    phoneNumber: "871-624-9360",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc7" },
    firstName: "Verney",
    lastName: "Dmitrovic",
    fullName: "Verney Dmitrovic",
    email: "vdmitrovic2n@godaddy.com",
    role: "marketing",
    phoneNumber: "446-926-2589",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc8" },
    firstName: "Win",
    lastName: "Burdoun",
    fullName: "Win Burdoun",
    email: "wburdoun2o@google.com",
    role: "admin",
    phoneNumber: "903-751-9968",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dc9" },
    firstName: "Dion",
    lastName: "Woollcott",
    fullName: "Dion Woollcott",
    email: "dwoollcott2p@google.ca",
    role: "admin",
    phoneNumber: "601-708-7357",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dca" },
    firstName: "Abner",
    lastName: "Trumble",
    fullName: "Abner Trumble",
    email: "atrumble2q@xinhuanet.com",
    role: "developer",
    phoneNumber: "807-791-5233",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
  {
    id: { $oid: "653e3045fc13ae0b66c76dcb" },
    firstName: "Bradney",
    lastName: "Newns",
    fullName: "Bradney Newns",
    email: "bnewns2r@alexa.com",
    role: "developer",
    phoneNumber: "504-774-7018",
    status: "deactive",
    password: "Hello World",
    adminId: "653b89a7c77854001851218d",
  },
];

type filterQuery = { [x: string]: string[] };

interface BaseFilter {
  page: string;
}

interface filterInput extends BaseFilter {
  filters: string | object;
}

interface filtersReturn {
  filterQuery: filterQuery;
  pageNumber: number;
}

export const getFilterQueryNPage = ({
  page,
  filters,
}: filterInput): filtersReturn => {
  let pageNumber = Number(page) ?? 0;

  if (pageNumber > 0) {
    pageNumber = pageNumber - 1;
  }

  try {
    filters = JSON.parse(filters as string);
  } catch (err) {
    filters = {};
  }

  let filterQuery: any = {};

  Object.keys(filters).map((key) => {
    if (filters[key].length > 0) {
      filterQuery[key] = { $in: filters[key] };
    }
  });

  return { pageNumber, filterQuery };
};
//

const router = express.Router();

router.post(
  "/api/users/team/v1",
  TeamBodyRequest,
  validateRequest,
  requireAuth,
  // hasPermissions(["create_team"]),
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, permissions, role } =
      req.body;
    // verified
    const existingUser = await UserService.findOne(email);

    const { id: adminId } = req.currentUser || {};

    if (existingUser) {
      throw new BadRequestError(messages.emailExists);
    }

    const permissionObject = permissions.map((permission:string) => new mongoose.Types.ObjectId(permission));

    // Checking if permission is exists in collection
    const isAllPermissionExits = await Permission.find({_id: {$in: permissionObject}});
    
    if(isAllPermissionExits.length !== permissions.length) {
      throw new BadRequestError("All provided permissions was unable to find");
    }

    const user = await UserService.build({
      firstName,
      lastName,
      email,
      password,
      permissions,
      role,
      verified: true,
      adminId,
    });

    const mapIds = permissions.map((permission) => new mongoose.Types.ObjectId(permission));
    // const findPermissions = await Permission.find({_id: {$in: mapIds}});
    

    res.status(201).send(user);

    try {
      const getWelcomeEmailTempalte = await readFile("welcome-team.html", {
        firstName,
        email,
        password,
      });

      const sendWelcomeEmail = await sendMail({
        from: mailerEmail,
        to: email,
        subject: "Welcome to Customize.io - Your Account Has Been Created!",
        text: "",
        html: getWelcomeEmailTempalte,
      });
      logger.log("info", messages.wcSent, sendWelcomeEmail);
    } catch (err) {
      logger.log("error", `${messages.wcCanNotSent} ${err}`);
    }
  }
);

router.get("/api/users/team/v1", requireAuth, async (req: Request, res: Response) => {
  const page = (req.query.page ?? 0) as string;

  const filters = req.query.filters as string;

  const { pageNumber, filterQuery } = getFilterQueryNPage({ page, filters });
  const adminId = req.currentUser?.id;
  const affectedRows = await User.countDocuments({...filterQuery, adminId});

  const users = await User.find({...filterQuery, adminId}, {})
    .skip(Number(pageNumber) * limit)
    .limit(limit)
    

  res.send({ users, affectedRows });
});


router.post(
  "/api/users/team/check-email",
  requireAuth,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const existingUser = await UserService.findOne(email);

    if (existingUser) {
      throw new BadRequestError(messages.emailExists, "email");
    }

    return res.status(200).send(null);
  }
);

router.get("/api/users/team/mock", async (req: Request, res: Response) => {
  try {
    await User.insertMany(mockUsers);
    res.send("Team successfully added");
  } catch (err) {
    res.send(`Could not insert team ${err}`);
    throw new Error(`Could not insert team ${err}`);
  }
});

router.get('/api/users/v1/:id', requireAuth, async(req: Request, res:Response) => {
  let id:string|mongoose.Types.ObjectId = '';

   const userId = req.params.id;
   id = new mongoose.Types.ObjectId(userId);
   
   

  try {
    const user = await User.findOne({_id: id}).populate('permissions');
    res.send(user);
  } catch (err:any) {
    logger.log('error', `Can not find user ${err}`);
    throw new Error(err);
  }
})

router.delete('/api/users/team/v1/:id', async(req: Request, res:Response) => {
  const {id} = req.params;

  if(!id) {
    throw new BadRequestError('Please provide user id to delete');
  }

  try {
    await UserService.deleteOne(id);
    res.send('User deleted successfully');
  } catch(err) {
    logger.log('error', `Could not delete error ${err}`);
    throw new Error(`Could not delete error ${err}`);
  }
});

// APis only for the testing
router.get('/api/users/v1/all', async(req:Request, res:Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch(err:any) {
    throw new Error(err);
  }
})

export { router as teamRouter };
