import request from "supertest";
import { app } from "../../app";
import { signUpVerifyUserGetToken } from "./common.test";

const permission = {
  name: "list_leads",
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

it("make request to verification code api", async () => {
  const response = await request(app)
    .post("/api/users/verify")
    .send({})
    .expect(400);
  const json = JSON.parse(response.text);

  expect(json.errors[0]["field"]).toEqual("verificationCode");
});

it("return not found If invalid verfication code is provided", async () => {
  await request(app)
    .post("/api/users/verify")
    .send({ verificationCode: 44545 })
    .expect(404);
  //   Verification code not found
});

it("will verify the user and will set the auth token to the cookie header", async () => {
  // Create permission first
  await signUpVerifyUserGetToken(app);
});
