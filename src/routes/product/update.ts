import {
  requireAuth,
  validateRequest
} from "@pasal/common";
import logger from "@pasal/common/build/logger";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { febricBodyRequest } from "../../body-request/FebricBodyRequest";
import { FebricService } from "../../services/Febric.Service";

const router = express.Router();

//
router.patch(
  "/api/products/v1/:id",
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

    let { id } = req.params as any;
   
    id = new mongoose.Types.ObjectId(id);

    try {
      const febric = await FebricService.findByIdAndUpdate(
        id,
        {
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
        },
        { new: true }
      );
      res.status(201).send(febric);
      // Publish an event that febric is updated
    } catch (err) {
      logger.log("error", "Could not create febric", err);
      throw new Error(`Could not create febric ${err}`);
    }
  }
);

export { router as updateFebricRouter };

