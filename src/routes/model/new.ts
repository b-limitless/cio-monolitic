import { validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import { ModelBodyRequest } from "../../body-request/model/Model.body-request";
import { ModelService } from "../../services/Model.Service";
import { ModelDoc } from "../../models/model";

const router = express.Router();

router.post(
  "/api/model",
  ModelBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, title, price, model, name }  = req.body;

    const buildModel = await ModelService.build({type, title, price, model, name} as ModelDoc);

    res.status(201).send(buildModel);
  }
);

export { router as createModelRouter };

