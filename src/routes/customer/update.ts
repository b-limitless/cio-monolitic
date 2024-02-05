import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";
import { CustomerUpdateBodyRequest } from "../../body-request/customer/Customer.update.body-request";
import mongoose from "mongoose";
import { CustomerService } from "../../services/Customer.Service";
import logger from "../../logger";

const router = express.Router();

router.put(
    "/api/customer",
    CustomerUpdateBodyRequest,
    validateRequest,
    requireCustomerAuth,
    async (req: Request, res: Response) => {
      // access the customer id throw the session
      const customerId = req?.currentCustomer?.id;
      const {
        height = null,
        inch = null,
        weight = null,
        age = null,
        unite = null,
        firstName = null,
        lastName = null,
      } = req.body;
      try {
        const filter = { _id: new mongoose.Types.ObjectId(customerId) };
        const update = {
            height,
            inch,
            weight,
            age,
            unite,
            firstName,
            lastName,
        };
        const updateCustomer =
          await CustomerService.findOneAndUpdateOrInsert(
            filter,
            update,
            {}
          );
  
        res.json(updateCustomer);
      } catch (err) {
        logger.log("error", `Could not update the shirt measurement ${err}`);
        throw new Error(`Could not update the shirt measurement ${err}`);
      }
    }
  );

export { router as customerUpdateRouter };
