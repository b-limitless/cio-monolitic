// Since we are developing in isolate model
// Any event which is listening and publishing visa RabbitMQ has been disabled
// So that we can develop fast few features which RabbitMQ does not required
// We will have to keep the copy of state in each services
// For example in User Service, Febric model should be available
// In Product Service - Febric, User model should be present and
// As soon as User is created it must publish the event and store the data
import {
  requireAuth,
  validateRequest
} from "@pasal/common";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { febricBodyRequest } from "../../body-request/Febric.body-request";

import { Febric } from "../../models/febric";
import { FebricService } from "../../services/Febric.Service";
import { febrics } from "./dummyFebric";
import { dummyFebric1 } from "./dummyFebric-1";
import logger from "../../logger";


const router = express.Router();

router.post(
  "/api/products/v1",
  requireAuth,
  // hasPermissions(["create_febric"]),
  febricBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      deliveryTime,
      excellence,
      warmth,
      weight,
      // season,
      threadStyle,
      brightness,
      superShiny,
      // material,
      tone,
      // threadCount,
      opacity,
      waterproof,
      stretchyText,
      stretchy,
      mis,
      type,
      febricTypes,
      febricSeasons,
      threadTypes,
      threadCounts,
      characters,
      thumbnailImageUrl,
      originalImageUrl,
      compositions
    } = req.body;

    const userId = new mongoose.Types.ObjectId(req?.currentUser?.id);
    try {
      const febric = await FebricService.build({
        userId,
        title,
        price,
        deliveryTime,
        excellence,
        warmth,
        weight,
        // season,
        threadStyle,
        brightness,
        superShiny,
        // material,
        tone,
        // threadCount,
        opacity,
        waterproof,
        stretchyText,
        stretchy,
        mis,
        type,
        febricTypes,
        febricSeasons,
        threadTypes,
        threadCounts,
        characters,
        thumbnailImageUrl,
        originalImageUrl,
        compositions
      });
      res.status(201).send(febric);

      try {
        let { id, userId:uId } = febric;
        const febricId = new mongoose.Types.ObjectId(id);
        
       
        logger.log("info", "product created event has been fired");
        logger.log("info", {febricId,
          userId,
          ...req.body});
      } catch (err) {
        console.log(err);
      }

      return;
    } catch (err) {
      logger.log("error", `Could not create febric ${err}`);
      console.log(`Could not create febric ${err}`)

      throw new Error(`Could not create febric ${err}`);
    }
  }
);

router.get('/api/products/insert', async(req: Request, res:Response) => {
  try {
    await Febric.insertMany(dummyFebric1);
    res.send('data inserted sucessfully')
  } catch(err:any) {
    throw new Error(`Can not insert data ${err}`);
  }
  
});

export { router as createFebricRouter };
