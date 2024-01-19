import { CustomerDoc } from "../models/customer";

export const customerDTO = (customer: CustomerDoc) => {
    const {
      _id,
      email,
    } = customer;
  
    return {
      id: _id,
      email
    };
  };