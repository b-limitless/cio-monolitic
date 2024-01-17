import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

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

it("throw 400 error when no email supplied", async () => {
  await request(app).post("/api/users/signin").send({}).expect(400);
});

it("throw 400 error when invalid email supplied email supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdfsf" })
    .expect(400);
});

it("throw 400 error when no password supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdfsf@gmail.com" })
    .expect(400);
});

it("faild when invalid username and password is provided", async () => {
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "bharatrose1@gmail.com",
      password: "password",
    })
    .expect(400);
  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors[0].message).toEqual("Invalid credentials");
});

it("sign in with the unverified dummyUser", async () => {
  const dummyUser = { email: "bharatrose1@gmail.com", password: "thisismylife" };
  

  await request(app)
    .post("/api/users/signup")
    .send({
      ...dummyUser,
      permissions: [globalId],
      role: "admin",
      industry: ["fashion"],
    })
    .expect(201);

  // Now lets try to login
  await request(app)
    .post("/api/users/signin")
    .send({ ...dummyUser})
    .expect(400);

  // const parseResponse = JSON.parse(login.text);

  // expect(login.get("Set-Cookie")).toBeDefined();
});

it("create user, verify and successfully signin", async () => {
  const dummyUser = { email: "bharatrose1@gmail.com", password: "thisismylife" };
 

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      ...dummyUser,
      permissions: [globalId],
      role: "admin",
      employeeCount: 50,
      industry: ["fashion"],
    })
    .expect(201);

    const {verificationCode,  user} = JSON.parse(response.text);

    expect(user.verified).toEqual(false);

    // Lets verify the user
   const verifyUser =  await request(app)
    .post("/api/users/verify")
    .send({ verificationCode: verificationCode })
    .expect(200);
    expect(verifyUser.get("Set-Cookie")).toBeDefined();

    console.log("verified user", verifyUser.text)
  

  const findUser = await User.findOne({email: "bharatrose1@gmail.com", verified: true});

  console.log("findUser", findUser);
  // Now lets try to login
  const signInResponse = await request(app)
    .post("/api/users/signin")
    .send({ ...dummyUser})
    .expect(201);

    console.log("signInResponse", signInResponse.text)

  //expect(signInResponse.get("Set-Cookie")).toBeDefined();
});
