import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";
import { rabbitMQWrapper } from "../../__mock__/rabbitMQWrapper";
import { UserCreatedPublisher } from "../../events/publishers/user-created-publisher";






beforeAll(async() => {
  jest.mock("@pasal/common", () => ({
    ...jest.requireActual("@pasal/common"),
    rabbitMQWrapper: rabbitMQWrapper // Use your custom mock implementation
  }));
  
  await rabbitMQWrapper.connect();
});

afterAll(async() => {
  await rabbitMQWrapper.close();
});

const permission = {
  name: 'globalId',
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

var globalId = null;

beforeEach(async () => {
  const res = await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);

  const {permission: {id}} = JSON.parse(res.text);
  globalId = id;
});

it("throw 401 error, if username and the password is not provided", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("usetype must be present while doing registration", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "bharatrose1@gmail.com", password: "thisismylife" })
    .expect(400);
});

it("return with 400 with invalid passwod", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@",
      password: "pas",
    })
    .expect(400);
});

it("return a 400 with missing email and password", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("throws 400 error if no permission is provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife"
    })
    .expect(400);
});

// const commonRequiredFiles = {
//   email: "bharatrose4@gmail.com",
//   password: "thisismylife",
//   permissions: [globalId],
//   role: "admin",
//   employeeCount: 50,
//   industry: ["fashion"],
// };

it("thow error if invalid verification code is provided", async() => {
  try { 
    // // Send the verification code to the api
   await request(app)
     .post("/api/users/verify")
     .send({verificationCode: 45564})
     .expect(404);
  } catch (err: any) {
    console.log("err", err.message);
  }
});


it("registere user sucessfully initially user is not verified and its sends request to verify user", async () => {
  try {
  

    const res = await request(app)
      .post("/api/users/signup")
      .send({
        email: "abcdefgh86@gmail.com",
        password: "test",
        permissions: [globalId],
        role: "admin",
        employeeCount: 50,
        industry: ["fashion"],
      })
      .expect(201);

    // Extract verification code 
    const {verificationCode, user: {id, verified}} = JSON.parse(res.text);
    
    expect(verified).toEqual(false);
    // // Send the verification code to the api
   await request(app)
     .post("/api/users/verify")
     .send({verificationCode})
     .expect(200);

    // // //  Find the user by that id 
    const findUser = await User.findById(id);

    // const {verified} = findUser;
    expect(findUser?.verified).toEqual(true);
  } catch (err: any) {
    console.log("err", err.message);
  }
});


it("disallowed duplicate email registration", async () => {
  try {
    

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "bharatrose1@gmail.com",
        password: "thisismylife",
        permissions: [globalId],
        role: "admin",
        employeeCount: 50,
        industry: ["fashion"],
      })
      .expect(201);

    const res =  await request(app)
      .post("/api/users/signup")
      .send({
        email: "bharatrose1@gmail.com",
        password: "thisismylife",
        permissions: [globalId],
        role: "admin",
        employeeCount: 50,
        industry: ["fashion"],
      })
      .expect(400);

    const {errors} = JSON.parse(res.text);
    expect(errors[0]["message"]).toEqual("Email address already exists");
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
});

it("Register user with target market", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose4@gmail.com",
      password: "thisismylife",
      permissions: [globalId],
      role: "admin",
      employeeCount: 50,
      industry: ["fashion"],
      targetMarket: ["fashion"],
    })
    .expect(201);
});

