import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ShirtMeasurmeentBodyRequest } from "../../body-request/measurement/shirt/Shirt.measurement.body-request";
import logger from "../../logger";
import { ShippingBodyRequest } from "../../body-request/shipping/Shipping.body.request";
import { ShippingService } from "../../services/Shipping.Service";

const router = express.Router();

router.post(
  "/api/shipping",
  requireCustomerAuth,
  ShippingBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    // access the customer id throw the session
    const customerId = req?.currentCustomer?.id;
    const {
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      countryCode,
      email
    } = req.body;
    try {
      const filter = { customerId: new mongoose.Types.ObjectId(customerId) };
      const update = {
        
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        countryCode,
        email
      };

      const updateShipping =
        await ShippingService.findOneAndUpdateOrInsert(
          filter,
          update,
          {}
        );

      res.json(updateShipping);
    } catch (err) {
      logger.log("error", `Could not update the shipping ${err}`);
      throw new Error(`Could not update the shipping ${err}`);
    }
  }
);

export { router as newShippingRouter };
