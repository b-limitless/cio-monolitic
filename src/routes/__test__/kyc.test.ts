import request from "supertest";
import { app } from "../../app";

it("Throw an 403 error if user is not authenticaled", async () => {
  await request(app).post("/api/users/kyc").send({}).expect(401);
});

it("will singup, verify user and will receive token, kyc will start, ", async () => {
  await request(app)
    .post("/api/users/kyc")
    .set("Cookie", global.signin([]))
    .send({ employeeCount: 20 })
    .expect(201);
});

it("create kyc with industry data", async () => {
  const res = await request(app)
    .post("/api/users/kyc")
    .set("Cookie", global.signin([]))
    .send({
      employeeCount: 20,
      industry: ["json"],
      currentWorkFlow: "hello wrold",
      painPoint: "something we had",
    })
    .expect(201);

  const parseRes = JSON.parse(res.text);

  expect(parseRes.industry).toEqual(["json"]);
  expect(parseRes.currentWorkFlow).toEqual("hello wrold");
  expect(parseRes.painPoint).toEqual("something we had");
});
