import request from "supertest";
import { app } from "../../../app";

const shipping = {
  firstName: "John",
  lastName: "Doe",
  addressLine1: "123 Main St",
  addressLine2: "Apt 4",
  city: "Cityville",
  state: "Stateville",
  postalCode: "12345",
  country: "Countryland",
  phoneNumber: "1234567890",
  countryCode: "+1",
  email: "john.doe@example.com",
};

it("it throw 401 error if the customer is not logged in", async () => {
  await request(app).post("/api/shipping").send({}).expect(401);
});

it("if customer is logged in then it throw 201 create or updated", async () => {
  const respones = await request(app)
    .post("/api/shipping")
    .set("Cookie", global.signinCustomer())
    .send(shipping)
    .expect(200);

  const { firstName } = JSON.parse(respones.text);

  expect(firstName).toEqual('John');
});
