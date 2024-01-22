import mongoose from "mongoose";
import logger from "../logger";
import { Cart, CartAttrs } from "../models/cart";

export class CartServiceLocal {
  async findOne(id: string) {
    const existingModel = await Cart.findOne({ id });
    return existingModel;
  }

  async build(data: CartAttrs) {
    try {
      const cart = Cart.build({ ...data });
      await cart.save();
      return cart;
    } catch (err: any) {
      logger.log("error", `Could not save Model: ${err}`);
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await Cart.findByIdAndUpdate(id, update, options);

      return updated;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findById(id: string) {
    try {
      const find = await Cart.findByIdAndUpdate(id);
      return find;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findByWhereCluse(data: any) {
    try {
      const find = await Cart.findOne({ ...data });
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(id: string) {
    try {
      await Cart.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (err) {
      logger.log("info", `Can not delete Model ${err}`);
      throw new Error(`Can not delete Model ${err}`);
    }
  }
}

const CartService = new CartServiceLocal();

export { CartService };