import express from "express";
import fs from "fs";
import multer from "multer";
import { uploadFileToCloudinary } from "../../common/uploadFileToCloudinary";
import logger from "@pasal/common/build/logger";
import { BadRequestError, requireAuth } from "@pasal/common";

const router = express.Router();
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
// Make server available
router.post(
  "/api/products/v1/upload",
  // requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { originalImageUrl, thumbnailImageUrl, filePath } =
        await uploadFileToCloudinary("ABC", req.file);
      res.send({ originalImageUrl, thumbnailImageUrl, filePath });
      fs.unlinkSync(filePath);
      return;
    } catch (err) {
      logger.log("error", err);
      throw new BadRequestError(`Error while uploading file ${err}`);
    }
  }
);

export { router as uploadeRouter };
