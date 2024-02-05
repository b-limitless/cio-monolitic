import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ShirtMeasurmeentBodyRequest } from "../../body-request/measurement/shirt/Shirt.measurement.body-request";
import logger from "../../logger";
import { ShirtMeasurementService } from "../../services/ShirtMeasurement.Service";

const router = express.Router();

router.post(
  "/api/shirt/measurement",
  ShirtMeasurmeentBodyRequest,
  validateRequest,
  requireCustomerAuth,
  async (req: Request, res: Response) => {
    // access the customer id throw the session
    const customerId = req?.currentCustomer?.id;
    const {
      sleevLength = null,
      shoulderWidth = null,
      chestAround = null,
      stomach = null,
      bicepAround = null,
      torsoLength = null,
      hips = null,
      wrist = null,
      neck = null,
    } = req.body;
    try {
      const filter = { customerId: new mongoose.Types.ObjectId(customerId) };
      const update = {
        sleevLength,
        shoulderWidth,
        chestAround,
        stomach,
        bicepAround,
        torsoLength,
        hips,
        wrist,
        neck,
      };

      const updateShirtMeasurement =
        await ShirtMeasurementService.findOneAndUpdateOrInsert(
          filter,
          update,
          {}
        );

      res.json(updateShirtMeasurement);
    } catch (err) {
      logger.log("error", `Could not update the shirt measurement ${err}`);
      throw new Error(`Could not update the shirt measurement ${err}`);
    }
  }
);

export { router as newMeasurementRouter };
