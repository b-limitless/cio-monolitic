import { BadRequestError, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";
import { messages } from "../../messages";
import { CustomerService } from "../../services/CustomerService";

const router = express.Router();

router.post(
  "/api/customer/signup",
  CustomerBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
    } = req.body;

    const existingCustomer = await CustomerService.findOne(email);

    if (existingCustomer) {
      throw new BadRequestError(messages.emailExists, 'email');
    }


    const customer = await CustomerService.build({
      email,
      password
    });

    res.status(201).send({ customer });
  }
);

export { router as customerSignupRouter };
