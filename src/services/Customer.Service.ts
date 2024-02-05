import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import logger from "../logger";
import { Customer } from "../models/customer";
import { NotFoundError } from "@pasal/common";

export class CustomerServiceLocal {
  async findOne(email: string) {
    const existingCustomer = await Customer.findOne({ email });
    return existingCustomer;
  }

  async build(data: any) {
    try {
      const customer = Customer.build({ ...data });
      await customer.save();
      return customer;
    } catch (err: any) {
      logger.log("error", `Could not save Customer: ${err}`);
      throw new Error(err);
    }
  }
  async findById(id: mongoose.Types.ObjectId) {
    try {
      const customer = await Customer.findById(id);
      return customer;
    } catch (err: any) {
      logger.log("error", `Could not find customer: ${err}`);
      throw new Error(err);
    }
  }
  async findOneAndUpdateOrInsert(
    filter: FilterQuery<any>,
    update: UpdateQuery<any>,
    options: any
  ) {
    try {
      const updated = await Customer.findOneAndUpdate(filter, update, {
        ...options,
        upsert: true,
        new: true,
        runValidators: true,
      });
      return updated;
    } catch (err) {
      logger.log("info", `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }
}

const CustomerService = new CustomerServiceLocal();

export { CustomerService };
