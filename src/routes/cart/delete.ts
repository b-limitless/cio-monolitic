/**
 * Delete product by product id
 * For security concert we need to add customerId who is deleting the item either
 * only customer id or session id, both can not be possible because customer id will be
 * the same but session can be different therefore its important to considere this
 * **/
import { BadRequestError, NotFoundError } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import logger from "../../logger";
import { CartService } from "../../services/Cart.Service";
import { Cart } from "../../models/cart";

const router = express.Router();

router.delete("/api/cart/:id", async (req: Request, res: Response) => {
  const customerId = req?.currentCustomer?.id
    ? new mongoose.Types.ObjectId(req.currentCustomer.id)
    : null;
  const sessionId = req?.currentCartSession?.id;
  const id = new mongoose.Types.ObjectId(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid cart id provided");
  }

  const filter: any = { _id: id };

  if (customerId) {
    filter.customerId = customerId;
  } else if (sessionId) {
    filter.sessionId = sessionId;
  }

  if (!customerId && !sessionId) {
    throw new BadRequestError("Could not delete the cart item");
  }

  const cart = await CartService.deleteOneByWhereClause(filter);

  if (!cart) {
    throw new NotFoundError("Unable to find the cart");
  }

  try {
    const deleteCart = await CartService.deleteOneByWhereClause(filter);

    res.json(deleteCart);
  } catch (error: any) {
    logger.log("error", `Could not delete cart ${error}`);
    throw new Error(`Could not delete cart ${error}`);
  }
});

/****/
router.delete("/api/cart", async (req: Request, res: Response) => {
  if (["development", "test"].indexOf(process.env.NODE_ENV as string) !== -1) {
    return res.send("Could not delete the cart");
  }
  try {
    await Cart.deleteMany();
    res.send("All Cart Items is deleted");
  } catch (err) {}
});

export { router as deleteCartRouter };
