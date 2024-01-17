import request from "supertest";
import { User } from "../../models/user";

export async function signUpVerifyUserGetToken(app: any) {
  const permission = {
    name: 'globalId',
    cat: "ifa",
    guard_name: "sales",
    role: "sales executive",
  };
  
  var globalId = null;
  
  
    const res = await request(app)
      .post("/api/users/permission/create")
      .send(permission)
      .expect(200);
  
    const {permission: {id}} = JSON.parse(res.text);
    
  

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "bharatrose1@gmail.com",
      password: "thisismylife",
      permissions: [id],
      role: "admin",
      employeeCount: 50,
      industry: ["fashion"],
    })
    .expect(201);

  const { verificationCode, user } = JSON.parse(response.text);

  expect(user.verified).toEqual(false);

  // Lets verify the user
  const verifyUser = await request(app)
    .post("/api/users/verify")
    .send({ verificationCode: verificationCode })
    .expect(200);
  expect(verifyUser.get("Set-Cookie")).toBeDefined();

  const token = verifyUser.get("Set-Cookie");

  const findUser = await User.findById(user.id);

  expect(findUser?.verified).toEqual(true);

  return token;
}

it("is a dummy test", async() => {
  
})