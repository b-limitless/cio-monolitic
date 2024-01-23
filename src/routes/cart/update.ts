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

router.patch(
  "/api/cart/:id",
  CartBodyRequest,
  validateRequest,
  // requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = new mongoose.Types.ObjectId(req?.currentCustomer?.id) ?? null; // or simply say clientCartSession object
    const cartSession = req?.currentCartSession?.id;
    const id = new mongoose.Types.ObjectId(req.params.id);

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
    } = req.body;

    //customerId, sessionId: cartSession, 
    const filter = {customerId,  _id: id, sessionId: cartSession};

    console.log('filter = {customerId,  _id: id};', {customerId,  _id: id})

    try {
      const cart = await CartService.findByWhereClauseAndUpdate(filter, 
         {
            originalImageUrl,
            thumbnailImageUrl,
            model,
            febric,
            modelType,
            subTotal,
            qty,
            discount,
            availability,
            deliveryTime,
        }, 
         {new: true});

         console.log('cart', cart)
     
    //   res.json(cart);
      res.json(cart);

    } catch (err: any) {
      throw new Error(err);
    }

  }
);

export { router as updateCartRouter };
