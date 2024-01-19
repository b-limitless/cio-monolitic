import { BadRequestError, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";
import { messages } from "../../messages";
import { CustomerService } from "../../services/Customer.Service";
import jwt from "jsonwebtoken";
import { customerDTO } from "../../dto/customer.dto";
import { ModelBodyRequest } from "../../body-request/model/Model.body-request";

const router = express.Router();

router.post(
  "/api/model",
  ModelBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, title, price, model, name } = req.body;

    const buildModel = await CustomerService.build({type, title, price, model, name});

    res.status(201).send(buildModel);
  }
);

export { router as customerSignupRouter };

