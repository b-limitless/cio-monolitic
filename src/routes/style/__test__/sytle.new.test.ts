import request from "supertest";
import { app } from "../../../app";

const style = {
  type: "shirt",
  partName: "collar",
  price: 39.99,
  code: "CS123",
  label: "BrandX",
  modelURL: "Slim Fit",
  mediaUrl: "URL for the media logo"
};
it("throw bad request error if not request body is provided", async () => {
  await request(app).post("/api/style").send({}).expect(400);
});

it("create style if all data is provided", async () => {
    const response = await request(app).post("/api/style").send(style).expect(201);

    console.log('response.text', response)
    // const parseResponse = JSON.parse(response.text);
    // expect(parseResponse.type).toEqual('shirt');
});
