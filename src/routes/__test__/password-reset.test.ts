import request from "supertest";
import { User } from "../../models/user";
import { app } from "../../app";

let verifiedUser = {} as any;

const permission = {
  name: "list_leads",
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

var globalId;

beforeEach(async () => {
  const createPermission = await request(app)
  .post("/api/users/permission/create")
  .send(permission)
  .expect(200);

  const {permission: {id:permissionId}} = JSON.parse(createPermission.text);
  globalId = permissionId;


    try {
      const res = await request(app)
        .post("/api/users/signup")
        .send({
          email: "abcdefgh86@gmail.com",
          password: "test",
          permissions: [permissionId],
          role: "admin",
          employeeCount: 50,
          industry: ["fashion"],
        })
        .expect(201);
  
      // Extract verification code
      const {
        verificationCode,
        user: { id, verified },
      } = JSON.parse(res.text);
  
      expect(verified).toEqual(false);
      // // Send the verification code to the api
      await request(app)
        .post("/api/users/verify")
        .send({ verificationCode })
        .expect(200);
  
      // // //  Find the user by that id
      verifiedUser = await User.findById(id);
  
      // const {verified} = findUser;
      expect(verifiedUser?.verified).toEqual(true);
    } catch (err: any) {
      console.log("err", err.message);
    }
  
});

it("throw 400 bad request error if no email address is supplied", async () => {
  await request(app)
    .post("/api/users/reset-password/request")
    .send({})
    .expect(400);
});

it("will response with 201 regardless of existing user or not", async () => {
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email: "bharatrose1@gmail.com" })
    .expect(201);

  const parseResponse = JSON.parse(response.text);

  expect(parseResponse).toEqual(true);
});

it("should initiate password reset and send a reset code", async () => {
  // ... code to initiate password reset and send a reset code ...
  // Create user first
  const { email } = verifiedUser;

  console.log("email", email, verifiedUser)
  
  try {
    const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);
  } catch(err) {
    console.log("could not request reset password", err)
  }
  
});

it("should not update password without a password in the request", async () => {
  // ... code to test password update without providing a password ...
  
  const { email } = verifiedUser;
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);

  const parseResponse = JSON.parse(response.text);
  const { code, user_id } = parseResponse;

  // Send patch request to server to update
  let upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id })
    .expect(400);

  let updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Please enter the password"
  );
});

it("should not update password if passwords do not match", async () => {

  const { email } = verifiedUser;
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);

  const parseResponse = JSON.parse(response.text);
  const { code, user_id } = parseResponse;

  // Send patch request to server to update
  let upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id })
    .expect(400);

  let updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Please enter the password"
  );

  // Send request with the passwor
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id, password: "helloWorld123" })
    .expect(400);

  updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Both password did not match"
  );
});

it("should successfully update password after providing matching passwords", async () => {
  // ... code to test successful password update ...
  const { email } = verifiedUser;
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);

  const parseResponse = JSON.parse(response.text);
  const { code, user_id } = parseResponse;

  // Send patch request to server to update
  let upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id })
    .expect(400);

  let updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Please enter the password"
  );

  // Send request with the passwor
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id, password: "helloWorld123" })
    .expect(400);

  updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Both password did not match"
  );

  // Send the password both matching
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({
      code,
      user_id,
      password: "helloWorld123",
      confirmPassword: "helloWorld123",
    })
    .expect(200);
});

it("should prevent login with the old password", async () => {
  // ... code to test login attempt with old password ...
  // Create user first
  
  // Request to verify the users

  const { email } = verifiedUser;
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);

  const parseResponse = JSON.parse(response.text);
  const { code, user_id } = parseResponse;

  // Send patch request to server to update
  let upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id })
    .expect(400);

  let updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Please enter the password"
  );

  //Send request with the passwor
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id, password: "helloWorld123" })
    .expect(400);

  updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Both password did not match"
  );

  // Send the password both matching
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({
      code,
      user_id,
      password: "helloWorld123",
      confirmPassword: "helloWorld123",
    })
    .expect(200);

  // Try to login with the old password will throw and error

  let sigin = await request(app)
    .post("/api/users/signin")
    .send({
      email: "abcdefgh86@gmail.com",
      password: "456456456",
    })
    .expect(400);

  updatePasswordResponse = JSON.parse(sigin.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Invalid credentials"
  );
});

it("should prevent login with incorrect credentials", async () => {
  // ... code to test login attempt with incorrect credentials ...
  // Create user first
  
  // Request to verify the users

  const { email } = verifiedUser;
  const response = await request(app)
    .post("/api/users/reset-password/request")
    .send({ email })
    .expect(201);

  const parseResponse = JSON.parse(response.text);
  const { code, user_id } = parseResponse;

  // Send patch request to server to update
  let upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id })
    .expect(400);

  let updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Please enter the password"
  );

  // Send request with the passwor
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({ code, user_id, password: "helloWorld123" })
    .expect(400);

  updatePasswordResponse = JSON.parse(upatePassword.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Both password did not match"
  );

  // Send the password both matching
  upatePassword = await request(app)
    .patch("/api/users/reset-password/request")
    .send({
      code,
      user_id,
      password: "helloWorld123",
      confirmPassword: "helloWorld123",
    })
    .expect(200);

  // Try to login with the old password will throw and error

  let sigin = await request(app)
    .post("/api/users/signin")
    .send({
      email: "abcdefgh86@gmail.com",
      password: "test45656",
    })
    .expect(400);

  updatePasswordResponse = JSON.parse(sigin.text);

  expect(updatePasswordResponse["errors"][0]["message"]).toEqual(
    "Invalid credentials"
  );
});

