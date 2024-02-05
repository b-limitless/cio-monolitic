import request from "supertest";
import { app } from "../../../app";

it("it throw 401 error if the customer is not logged in", async () => {
  await request(app).post("/api/measurement").send({}).expect(401);
});

it('if customer is logged in then it throw 201 create or updated', async() => {
    await request(app)
    .post("/api/measurement")
    .set('Cookie', global.signinCustomer())
    .send({}).expect(200);
});