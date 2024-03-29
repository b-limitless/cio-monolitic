import request from "supertest";
import { app } from "../../../app";

it("throws error while creating accent without the requied data ", async () => {
  await request(app).post("/api/accent").send({}).expect(400);
});

it("throws error while creating accent without the requied data ", async () => {
  const data = {
    type: "shirt",
    partName: "collar",
    price: 12,
    febric: "string",
    meshName: ["bold", "sdfsfd"],
  };
  
  await request(app).post("/api/accent").send(data).expect(201);
});
