import request from "supertest";
import { app } from "../../../app";
import { CartService } from "../../../services/Cart.Service";

const cartData = {
  originalImageUrl:
    "https://res.cloudinary.com/dun5p8e5d/image/upload/v1704620406/images/ABC/xulgkzie5hkkrvpttxel.png",
  thumbnailImageUrl:
    "https://res.cloudinary.com/dun5p8e5d/image/upload/v1704620416/thumbnails/ABC/jtxc8moiphu8vwqrzjms.png",
  model: {
    collar: {
      id: 12,
      model: "/models/collars/collar-1-1.glb?timestamp=1704620380222",
      price: 0,
      title: "Default collar model",
      label: "default",
      code: "default",
    },
    cuff: {
      id: 12,
      model: "/models/cuffs/cuff-1-normal.glb?timestamp=1704620380222",
      price: 0,
      title: "default cuff model",
      label: "default",
      code: "default",
    },
  },
  accent: {
    collar: {
      id: 12,
      febric: "/img/febric-5.jpg",
      type: "default",
      meshName: [],
      updatedFrom: "febrics",
      price: 10,
    },
    cuff: {
      id: 12,
      febric: "/img/febric-5.jpg",
      type: "default",
      meshName: [],
      updatedFrom: "febrics",
      price: 10,
    },
  },
  modelType: "shirt",
  subTotal: 50,
  qty: 1,
  discount: 0,
  availability: "",
  id: 1,
  deliveryTime: "3 weeks",
  febric: {
    id: 1,
    model: "/img/febric-5.jpg",
    price: 30,
    title: "XYZ",
    material: "Cotton 80 %",
    tone: "light",
    febricTypes: "string",
    season: "summer",
    label: "default",
    code: "default",
    originalImageUrl: "/img/febric-5.jpg",
  },
  status: "open",
};

it("update the the cart item", async () => {
  // Create the cart first
  const qtyUpdate = 10;
  const subTotalUpdate = 100;

  const customer = global.signinCustomer();

  const response = await request(app)
    .post("/api/cart")
    .set("Cookie", customer)
    .send(cartData)
    .expect(200);

  const { customerId, sessionId, id } = JSON.parse(response.text);

  const newCart = JSON.parse(JSON.stringify(cartData));
  newCart.qty = 10;
  newCart.subTotal = 100;

  const updateCart = await request(app)
    .put(`/api/cart/${id}`)
    .set("Cookie", customer)
    .send(newCart)
    .expect(200);
  const { qty, subTotal } = JSON.parse(updateCart.text);

  expect(qty).toEqual(qtyUpdate);
  expect(subTotal).toEqual(subTotalUpdate);
});

it("update the cart qty", async () => {
  const customer = global.signinCustomer();
  // first create the cart
  const response = await request(app)
    .post("/api/cart")
    .set("Cookie", customer)
    .send(cartData)
    .expect(200);

  const { id } = JSON.parse(response.text);

  const updateCart = await request(app)
    .patch(`/api/cart/${id}`)
    .set("Cookie", customer)
    .send({ qty: 2 })
    .expect(200);

  const { qty } = JSON.parse(updateCart.text);

  expect(qty).toEqual(2);
});

it("will delete the item if qty provided to 0", async () => {
  const customer = global.signinCustomer();
  // first create the cart
  const response = await request(app)
    .post("/api/cart")
    .set("Cookie", customer)
    .send(cartData)
    .expect(200);

  const { id } = JSON.parse(response.text);

  await request(app)
    .patch(`/api/cart/${id}`)
    .set("Cookie", customer)
    .send({ qty: 0 })
    .expect(200);

  // There should not be cart with this id
  const findCart = await CartService.findById(id);

  expect(findCart).toBeNull();
});
