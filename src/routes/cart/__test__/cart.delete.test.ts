import request from "supertest";
import { app } from "../../../app";
import { cartData } from "./data";
import { Cart } from "../../../models/cart";
import mongoose from "mongoose";

it("create cart items and delete it", async () => {
  const signin = global.signinCustomer();

  const response = await request(app)
    .post("/api/cart")
    .set("Cookie", signin)
    .send(cartData)
    .expect(200);

  const { id } = JSON.parse(response.text);

  await request(app)
    .delete(`/api/cart/${id}`)
    .set("Cookie", signin)
    .send(cartData)
    .expect(200);

  const findDeletedCart = await Cart.findOne(new mongoose.Types.ObjectId(id));

  expect(findDeletedCart).toBeNull();
});
