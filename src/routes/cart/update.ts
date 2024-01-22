/**
 * When user is not authenticated then we basically create a session and store
 * that session key as user id, We can not inforce client to login to add product to the cart
 *
 * We are checking in this case that if customer is authenicated or we create the sesion for the user
 * **/
import { requireCustomerAuth, validateRequest } from "@pasal/common";
import { Cart, CartAttrs } from "../../models/cart";
import { Request, Response } from "express";
import express from "express";
import { CartBodyRequest } from "../../body-request/cart/Cart.body.request";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { CartService } from "../../services/Cart.Service";

const router = express.Router();

router.post(
  "/api/cart/:id",
  CartBodyRequest,
  validateRequest,
  // requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = req?.currentCustomer?.id; // or simply say clientCartSession object
    const cartSession = req?.currentCartSession?.id;
    const {id} = req.params;

    const {
      originalImageUrl,
      thumbnailImageUrl,
      status,
      model,
      febric,
      modelType,
      subTotal,
      qty,
      discount,
      availability,
      deliveryTime,
      orderId,
    } = req.body;

    const filter = {customerId, sessionId: cartSession, id: id};

    try {
    //   const cart = await CartService.findByWhereClauseAndUpdate();
     
    //   res.json(cart);
      return;

    } catch (err: any) {
      throw new Error(err);
    }

  }
);

export { router as CreateCartRouter };
