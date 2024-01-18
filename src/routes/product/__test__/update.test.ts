import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const subtract = 0;
const febricId = "64d36d6a42bb4b004d278323";

it("throw 401 un autorized error when there is no authentication", async () => {
  await request(app)
    .patch("/api/products/v1/64d36d6a42bb4b004d278323")
    .send({})
    .expect(401);
});

it("response with status 400 if user is authenticated", async () => {
  const response = await request(app)
    .patch("/api/products/v1/64d36d6a42bb4b004d278323")
    .set("Cookie", global.signin([]))
    .send({})
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(22 - subtract);
});

it("response with status 400 if only name is provided", async () => {
  const response = await request(app)
    .patch(`/api/products/v1/${febricId}`)
    .set("Cookie", global.signin([]))
    .send({ title: "coat" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(21 - subtract);
});

it("response with status 400 if only name and category is provided", async () => {
  const response = await request(app)
    .patch(`/api/products/v1/${febricId}`)
    .set("Cookie", global.signin([]))
    .send({ title: "coat", category: "cloth" })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors).toBeDefined();
  expect(parseResponse.errors.length).toStrictEqual(21 - subtract);
});

it("creates product and update at the same time", async () => {
  const user = global.signin([]);
  const febric = {
    title: "New Febric",
    price: 100,
    deliveryTime: "2 days",
    imageLink: "http://example.com/fabric-image.jpg",
    excellence: "4 rating stars",
    warmth: "3 rating stars",
    weight: "500 gr/m^2",
    season: "Summer",
    threadStyle: "Plain",
    brightness: "High",
    superShiny: false,
    material: "Cotton",
    tone: "Blue",
    threadCount: 300,
    opacity: "Opaque",
    waterproof: true,
    stretchyText: "Stretchy fabric",
    stretchy: true,
    mis: "New",
    type: "Pants",
    febricTypes: "Cotton",
    febricSeasons: "Winter",
    threadTypes: "Cotton",
    threadCounts: "200-400",
    characters: ["New", "Comfortable", "Durable"],
    originalImageUrl: "d",
    thumbnailImageUrl: "d",
  };

  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", user)
    .send(febric)
    .expect(201);

  febric.title = 'updated febric';

  const updatedFebric = await request(app)
    .patch(`/api/products/v1/${response.body.id}`)
    .set("Cookie", user)
    .send(febric)
    .expect(201);

    const updatedResponse = JSON.parse(updatedFebric.text);
    expect(updatedResponse.title).toEqual('updated febric');

});
