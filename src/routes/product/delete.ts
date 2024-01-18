import {
  requireAuth
} from "@pasal/common";
import logger from "@pasal/common/build/logger";
import express, { Request, Response } from "express";
import { deleteMedia } from "../../common/uploadFileToCloudinary";
import { FebricService } from "../../services/FebricService";

const router = express.Router();

router.delete(
  "/api/products/v1/:id",
  requireAuth,
  // hasPermissions(["create_febric"]),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deleteFebric = await FebricService.findByIdAndDelete(id);
     
      await deleteMedia(deleteFebric?.originalImageUrl);
      await deleteMedia(deleteFebric?.thumbnailImageUrl);
      res.status(200).send(deleteFebric);
      // Publish the event that febric is deleted
      
      return;
    } catch (err) {
      logger.log("error", "Could not create febric");
      throw new Error("Could not create febric");
    }
  }
);

export { router as deleteFebricRouter };
