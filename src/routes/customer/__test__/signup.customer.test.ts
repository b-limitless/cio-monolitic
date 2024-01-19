import request from "supertest";
import { app } from "../../../app";
import { Customer } from "../../../models/customer";

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

it("signup customer successfully with valid email and password and set cookie", async () => {
  const signupCustomer = await request(app)
    .post("/api/customer/signup")
    .send({
      email: customer.email,
      password: "Hello World 123",
    })
    .expect(201);


  const token = signupCustomer.get("Set-Cookie");
  const {id} = JSON.parse(signupCustomer.text);

  expect(token).toBeDefined();

  const findUser = await Customer.findById(id);

  console.log('findUser', findUser)

//   expect(findUser.email).toEqual(true);
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
  