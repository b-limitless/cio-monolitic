import request from "supertest";
import { app } from "../../../app";
import { FebricAttrs } from "../../../models/febric";
import { signUpVerifyUserGetToken } from "./common.test";

const sampleFabric: FebricAttrs = {
  title: "Soft Cotton Blend",
  price: 25.99,
  deliveryTime: "2-3 business days",
  excellence: "High",
  warmth: "Moderate",
  weight: "Light",
  season: "All Seasons",
  threadStyle: "Smooth",
  brightness: "Neutral",
  superShiny: false,
  material: "Cotton Blend",
  tone: "Warm",
  threadCount: "300 TC",
  opacity: "Opaque",
  waterproof: false,
  stretchyText: "Slight Stretch",
  stretchy: true,
  mis: "Machine Washable",
  type: "Fabric",
  febricTypes: "Cotton Blend",
  febricSeasons: "All Seasons",
  threadTypes: "Smooth",
  threadCounts: "300 TC",
  characters: ["Soft", "Durable", "Breathable"],
  thumbnailImageUrl: "https://example.com/thumbnail.jpg",
  originalImageUrl: "https://example.com/original.jpg",
  compositions: [
    { component: "Cotton", percentage: 70 },
    { component: "Polyester", percentage: 30 },
  ],
};


const createProduct = async() => {
  const signin = global.signin([]);
  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", signin)
    .send(sampleFabric)
    .expect(201);

    console.log(response.get('Set-Cookie'));
    return response;
};

it("list a list of products", async () => {
  //  await createProduct();
  //  await createProduct();
  //  await createProduct();

  // const response = await request(app)
  //   .get("/api/products/v1")
  //   .expect(200);

  //   const parseText = JSON.parse(response.text);

  //   expect(parseText.febrics.length).toEqual(3);
});


// it('signup the user, verify and finally started to create febric and receives febrics', async() => {
//   const token = await signUpVerifyUserGetToken(app);

//   // Lets create the product

//   console.log('token', token)

// });