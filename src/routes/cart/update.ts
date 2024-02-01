/**
 * When user is not authenticated then we basically create a session and store
 * that session key as user id, We can not inforce client to login to add product to the cart
 *
 * We are checking in this case that if customer is authenicated or we create the sesion for the user
 * **/
import { validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { CartBodyRequest } from "../../body-request/cart/Cart.body.request";
import { UpdateQutyBodyRequest } from "../../body-request/cart/UpdateQty.body-request";
import { CartService } from "../../services/Cart.Service";
import logger from "../../logger";

const router = express.Router();

router.put(
  "/api/cart/:id",
  CartBodyRequest,
  validateRequest,
  // requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = req?.currentCustomer?.id ? new mongoose.Types.ObjectId(req.currentCustomer.id) : null; // or simply say clientCartSession object
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
      res.json(cart);

    } catch (err: any) {
      throw new Error(err);
    }

  }
);

router.patch('/api/cart/:id', 
validateRequest,
UpdateQutyBodyRequest,

async(req:Request, res:Response) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const {...rest} = req.body;

  try {
    const updated = await CartService.findByIdAndUpdate(id, rest, {new:true});
    res.json(updated);
  } catch(err) {
    logger.log('err', `Count not update the cart ${err}`);
    throw new Error(`Count not update the cart ${err}`)
  }


});

export { router as updateCartRouter };
