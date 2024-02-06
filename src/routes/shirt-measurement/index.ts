import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ShirtMeasurmeentBodyRequest } from "../../body-request/measurement/shirt/Shirt.measurement.body-request";
import logger from "../../logger";
import { ShirtMeasurement } from "../../models/shirt-measurement";

const router = express.Router();

router.get(
  "/api/shirt/measurement",
  ShirtMeasurmeentBodyRequest,
  validateRequest,
  requireCustomerAuth,
  async (req: Request, res: Response) => {
    const customerId = req?.currentCustomer?.id;
    try {
      const filter = { customerId: new mongoose.Types.ObjectId(customerId) };
      const fetchMeasurement = await ShirtMeasurement.findOne(filter).populate("customerId");
      console.log('fetchMeasurement', fetchMeasurement)
      res.json(fetchMeasurement);
    } catch (err) {
      logger.log("error", `Could not update the shirt measurement ${err}`);
      throw new Error(`Could not update the shirt measurement ${err}`);
    }
  }
);

export { router as indexMeasurementRouter };
