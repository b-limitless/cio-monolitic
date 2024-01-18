import request from "supertest";
import { app } from "../../app";
import { Febric } from "../../models/febric";


const  originalImageUrl ="https://res.cloudinary.com/dun5p8e5d/image/upload/v1691056368/images/ABC/aqycbx1lgccrndirskjn.webp";
const thumbnailImageUrl= "https://res.cloudinary.com/dun5p8e5d/image/upload/v1691056371/thumbnails/ABC/nqaljl0gyhctkagxj1q7.webp";

const subtract = 1;

it("throw 401 un autorized error when there is no authentication", async () => {
  const response = await request(app)
    .post("/api/products/v1")
    .send({})
    .expect(401);
  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors[0]["message"]).toEqual("Not Authorized");
});

// it("throw 401 error if user is authenticated but does not have create product prermission", async () => {
//   const response = await request(app)
//     .post("/api/products/v1")
//     .set("Cookie", global.signin([]))
//     .send({})
//     .expect(400);

//   const parseResponse = JSON.parse(response.text);
//   expect(parseResponse.errors[0]["message"]).toEqual(
//     "Not Authorized, Required following permission create_febric"
//   );
// });


it("will provided the required permission for the api create_febric", async () => {
  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({originalImageUrl , thumbnailImageUrl})
    .expect(400);

  const parseResponse = JSON.parse(response.text);
 
  expect(parseResponse.errors.length).toEqual(21 - subtract); // Could change in the future
 
});

it("provideds title will throw remaining error ", async () => {
  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({
      title: "This is febric",
    })
    .expect(400);

  const parseResponse = JSON.parse(response.text);

  
  expect(parseResponse.errors.length).toEqual(22 - subtract); // Could change in the future

});

it("provideds price will throw remaining error ", async () => {
  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({
      title: "This is febric",
      price: 455,
    })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors.length).toEqual(21 -subtract); // Could change in the future
});

it("provideds delivery_time will throw remaining error ", async () => {
  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({
      title: "This is febric",
      price: 455,
      deliveryTime: "3 days",
    })
    .expect(400);

  const parseResponse = JSON.parse(response.text);
  expect(parseResponse.errors.length).toEqual(20 - subtract); // Could change in the future
});

it("will provide all required data returns 201", async () => {
  const sampleData = {
    title: "Sample Fabric",
    price: 100,
    deliveryTime: "2 days",
    // imageLink: "http://example.com/fabric-image.jpg",
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
    originalImageUrl, 
    thumbnailImageUrl
  };

  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({ ...sampleData })
    .expect(201);

    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.userId).toBeDefined()
    expect(parseResponse.title).toEqual("Sample Fabric")
});

it("creates a febric and update it", async() => {
  const sampleData = {
    title: "Sample Fabric",
    price: 100,
    deliveryTime: "2 days",
    // imageLink: "http://example.com/fabric-image.jpg",
    excellence: "4 rating stars",
    warmth: "3 rating stars",
    weight: "500 gr/m^2",
    // season: "Summer",
    threadStyle: "Plain",
    brightness: "High",
    superShiny: false,
    // material: "Cotton",
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
    originalImageUrl, 
    thumbnailImageUrl
  };

  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({ ...sampleData })
    .expect(201);

    const parseResponse = JSON.parse(response.text);
    expect(parseResponse.userId).toBeDefined()
    expect(parseResponse.title).toEqual("Sample Fabric");

    // Updating the documents

    const updatedValues = {...sampleData, title: "This is new value"}; 
    const {id} = parseResponse;
    const update = await request(app)
    .patch(`/api/products/v1/${id}`)
    .set("Cookie", global.signin(["create_febric"]))
    .send({ ...updatedValues})
    .expect(201);

    const updatedResponse = JSON.parse(update.text);
    expect(updatedResponse.title).toEqual("This is new value")
}); 

it("create and delete a febric", async() => {
  const sampleData = {
    title: "Sample Fabric",
    price: 100,
    deliveryTime: "2 days",
    // imageLink: "http://example.com/fabric-image.jpg",
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
    originalImageUrl, 
    thumbnailImageUrl
  };

  const response = await request(app)
    .post("/api/products/v1")
    .set("Cookie", global.signin(["create_febric"]))
    .send({ ...sampleData })
    .expect(201);

    const parseResponse = JSON.parse(response.text);
    const {id} = parseResponse;

    try {
       await request(app)
      .delete(`/api/products/v1/${id}`)
      .set("Cookie", global.signin(["create_febric"]))
      .send({ })
      .expect(200);
      
    } catch(err) {
      console.log("Could not delete", err);
    }

    const findFebric = await Febric.findById(id);

    expect(findFebric).toBeNull();
});