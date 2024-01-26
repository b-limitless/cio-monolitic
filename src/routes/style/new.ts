import { validateRequest } from "@pasal/common";
import express from "express";
import { Request, Response } from "express";
import { StyleBodyValidator } from "../../body-request/style/Style.body-request";
import { StyleService } from "../../services/Style.Service";
import { StyleDoc } from "../../models/style";
import logger from "../../logger";
const router = express.Router();

router.post(
  "/api/style",
  StyleBodyValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, partName, price, code, label, modelURL, mediaUrl } = req.body;
    try {
      const style = await StyleService.build({
        type,
        partName,
        price,
        code,
        label,
        modelURL,
        mediaUrl
      } as StyleDoc);

      res.sendStatus(201).json(style); 

    } catch (err: any) {
        logger.log('error', `Could not create a style`)
        res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export { router as createStyleRouter };
