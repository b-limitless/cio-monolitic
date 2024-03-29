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
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/cart",
  CartBodyRequest,
  validateRequest,
  // requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = req?.currentCustomer?.id
      ? new mongoose.Types.ObjectId(req.currentCustomer.id)
      : null; // or simply say clientCartSession object
    const cartSession = req?.currentCartSession?.id;

    // If both customer session and cart session is not set
    // Then we need to set a session for that customer without login
    // Based on the client
    let token: any;
    const id = uuidv4();

    // if (req.session) {
    //   req.session.customerJwt = userJWT;
    // }

    // Distructure everything from the cart
    // const {}
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
      accent
    } = req.body;

    try {
      const cart = await CartService.build({
        customerId: customerId ?? null,
        originalImageUrl,
        thumbnailImageUrl,
        status,
        model,
        accent,
        febric,
        modelType,
        subTotal,
        qty,
        discount,
        availability,
        deliveryTime,
        orderId,
        sessionId: customerId ? null : cartSession ?? id,
      } as CartAttrs);

      token = jwt.sign({ id }, process.env.JWT_KEY!);

      console.log('id', id)

      if (!customerId && !cartSession) {
        if (req.session) {
          req.session.cart = token;
        }
      }

      res.json(cart);
      return;
    } catch (err: any) {
      throw new Error(err);
    }
  }
);

export { router as createCartRouter };
