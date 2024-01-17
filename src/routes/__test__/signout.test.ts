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


it("create user and clear the session", async () => {
  

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
    const findUser = await User.findById(id);

    // const {verified} = findUser;
    expect(findUser?.verified).toEqual(true);
  } catch (err: any) {
    console.log("err", err.message);
  }
 
  const logout = await request(app)
  .get("/api/users/signout")
  .expect(200);
  expect(logout.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=pasal.dev; httponly"
  );
});
