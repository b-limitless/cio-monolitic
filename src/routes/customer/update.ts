import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";

const router = express.Router();

router.post(
  "/api/customer/signup",
  CustomerBodyRequest,
  validateRequest,
  requireCustomerAuth,
  async (req: Request, res: Response) => {
    
  }
);

export { router as customerSignupRouter };
