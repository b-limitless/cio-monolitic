import request from "supertest";
import { app } from "../../../app";

it("throw un authroized error if user not authenticated", async () => {
  await request(app).post("/api/paypal").send({}).expect(401);
});

it("throw bad request error if client id and secret is not provided", async () => {
  await request(app)
    .post("/api/paypal")
    .set("Cookie", global.signin(["create_febric"]))
    .send({})
    .expect(400);
});

it("creates paypal security and client key", async () => {
  await request(app)
    .post("/api/paypal")
    .set("Cookie", global.signin(["create_febric"]))
    .send({ clientId: "sdfsdf", clientSecret: "345334" })
    .expect(200);
});
