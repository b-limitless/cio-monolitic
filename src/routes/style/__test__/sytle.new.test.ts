import request from "supertest";
import { app } from "../../../app";

const style = {
  type: "shirt",
  partName: "collar",
  price: 39.99,
  title: "Classic White Shirt",
  code: "CS123",
  label: "BrandX",
  model: "Slim Fit",
};
it("throw bad request error if not request body is provided", async () => {
  await request(app).post("/api/style").send({}).expect(400);
});

it("create style if all data is provided", async () => {
    await request(app).post("/api/style").send(style).expect(200);
});
