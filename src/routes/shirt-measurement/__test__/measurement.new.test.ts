import request from "supertest";
import { app } from "../../../app";

const measurement = {
    "sleevLength": 40,
    "shoulderWidth": 20,
    "chestAround": 20,
    "stomach": 20,
    "bicepAround": 20,
    "torsoLength": 20,
    "hips": 20,
    "wrist": 20,
    "neck": 20
};

it("it throw 401 error if the customer is not logged in", async () => {
  await request(app).post("/api/shirt/measurement").send({}).expect(401);
});

it('if customer is logged in then it throw 201 create or updated', async() => {
    const respones = await request(app)
    .post("/api/shirt/measurement")
    .set('Cookie', global.signinCustomer())
    .send(measurement).expect(200);
    
    const {sleevLength} = JSON.parse(respones.text);

    expect(sleevLength).toEqual(40);

});