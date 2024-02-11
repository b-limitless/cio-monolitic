import mongoose, { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import logger from "../logger";
import { Paypal, PaypalAttrs } from "../models/paypal";

export class PaypalServiceLocal {
  async findOne(id: string) {
    const existingModel = await Paypal.findOne({ id });
    return existingModel;
  }

  async build(data: PaypalAttrs) {
    try {
      const paypal = Paypal.build({ ...data });
      await paypal.save();
      return Paypal;
    } catch (err: any) {
      logger.log("error", `Could not save Model: ${err}`);
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(
    id: mongoose.Types.ObjectId,
    update: UpdateQuery<any>,  // Adjust the type as needed
    options: QueryOptions
  ): Promise<mongoose.Document  | null> {  // Specify the return type explicitly
    try {
      const updated = await Paypal.findByIdAndUpdate(id, update, options);
  
      return updated;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findByWhereClauseAndUpdate(filter:any, update:any, options:any) {
    try {
      const updatePaypal = await Paypal.findOneAndUpdate(filter, update, options)
      return updatePaypal;
    } catch(err:any) { 
      logger.log("info", `Can not find and update ${err}`);
      throw new Error(`Could not update the document ${err}`);
    }
  }

  async findById(id: mongoose.Types.ObjectId) {
    try {
      const find = await Paypal.findByIdAndUpdate(id);
      return find;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }
 
  async findByWhereCluse(data: FilterQuery<Partial<PaypalAttrs>>) {
    try {
      const find = await Paypal.findOne({ ...data });
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async find(data: FilterQuery<Partial<PaypalAttrs>>) {
    try {
      const find = await Paypal.find({...data});
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOneByWhereClause(data: FilterQuery<Partial<PaypalAttrs>>) {
    try {
      const find = await Paypal.deleteOne({ ...data });
      console.log('delete count', find.deletedCount)
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(id: mongoose.Types.ObjectId) {
    try {
      const deleteItem = await Paypal.deleteOne({ _id: id });
      return deleteItem;
    } catch (err) {
      logger.log("info", `Can not delete Model ${err}`);
      throw new Error(`Can not delete Model ${err}`);
    }
  }
}

const PaypalService = new PaypalServiceLocal();

export { PaypalService };
