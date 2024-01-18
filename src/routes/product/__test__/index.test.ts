import request from "supertest";
import { app } from "../../app";

const createProduct = () => {
  return request(app)
    .post("/api/products/v1/new")
    .set("Cookie", global.signin([]))
    .send({
      name: "hello",
      category: "category",
      subCategory: "subCategory",
      price: 3,
      availableItems: 100,
    })
    .expect(201);
};

it("list a list of products", async () => {
  // await createProduct();
  // await createProduct();
  // await createProduct();

  // const response = await request(app)
  //   .get("/api/products/v1")
  //   .send({})
  //   .expect(200);

  // expect(response.body.length).toEqual(3);
});
