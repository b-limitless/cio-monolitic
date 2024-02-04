import mongoose from "mongoose";
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
    } catch(err:any) {
      logger.log("error", `Could not find customer: ${err}`);
      throw new Error(err);
    }
    
  }
}

const CustomerService = new CustomerServiceLocal();

export { CustomerService };
