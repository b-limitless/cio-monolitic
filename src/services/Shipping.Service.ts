import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import logger from "../logger";
import { Shipping, ShippingAttrs } from "../models/shipping";

export class ShirtMeasurementServiceLocal {
  async findOne(id: string) {
    const existingAccent = await Shipping.findOne({ id });
    return existingAccent;
  }

  async build(data: ShippingAttrs) {
    try {
      const accent = Shipping.build({ ...data });
      await accent.save();
      return accent;
    } catch (err: any) {
      logger.log("error", `Could not save Shipping: ${err}`);
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await Shipping.findByIdAndUpdate(id, update, options);

      return updated;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findById(id: string) {
    try {
      const find = await Shipping.findByIdAndUpdate(id);
      return find;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findByWhereCluse(data: any) {
    try {
      const find = await Shipping.findOne({ ...data });
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(id: string) {
    try {
      await Shipping.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (err) {
      logger.log("info", `Can not delete Shipping ${err}`);
      throw new Error(`Can not delete Shipping ${err}`);
    }
  }

  async findOneAndUpdateOrInsert(
    filter: FilterQuery<any>,
    update: UpdateQuery<any>,
    options: any
  ) {
    try {
      const updated = await Shipping.findOneAndUpdate(filter, update, {
        ...options,
        upsert: true,
        new: true,
        runValidators: true,
      });
      return updated;
    } catch (err) {
      logger.log("info", `Can not find and update ${err}`);
      throw new Error(`Can not find and update ${err}`);
    }
  }
}

const ShippingService = new ShirtMeasurementServiceLocal();

export { ShippingService };
