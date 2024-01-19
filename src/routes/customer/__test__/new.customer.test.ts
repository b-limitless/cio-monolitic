import request from "supertest";
import { app } from "../../../app";

const customer = {
  email: "bharatrose1@gmail.com",
  password: "HelloWorld",
};

it("throw bad request if no email and password is provided ", async () => {
  await request(app).post("/api/customer/signup").send({}).expect(400);
});

it("throw bad request if no email and password is provided ", async () => {
  await request(app)
    .post("/api/customer/signup")
    .send({
      email: customer.email,
    })
    .expect(400);
});

it("signup customer successfully with valid email and password", async () => {
  await request(app)
    .post("/api/customer/signup")
    .send({
      email: customer.email,
      password: "Hello World 123",
    })
    .expect(201);
});

it("bad request if same registered eamil address provided", async () => {
    await request(app)
      .post("/api/customer/signup")
      .send({
        email: customer.email,
        password: "Hello World 123",
      })
      .expect(201);
  
      // Bad reqeust if same eamil address is provided
      await request(app)
      .post("/api/customer/signup")
      .send({
        email: customer.email,
        password: "Hello World 123",
      })
      .expect(400);
  });
  