import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import logger from "../../logger";
import { Shipping } from "../../models/shipping";

const router = express.Router();

router.get(
  "/api/shipping",
  validateRequest,
  requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = req?.currentCustomer?.id;
    try {
      const filter = { customerId: new mongoose.Types.ObjectId(customerId) };
      const fetchShipping = await Shipping.findOne(filter).populate("customerId");
      res.json(fetchShipping);
    } catch (err) {
      logger.log("error", `Could not fetch shipping ${err}`);
      throw new Error(`Could not fetch shipping ${err}`);
    }
  }
);

export { router as indexShippingRouter };
