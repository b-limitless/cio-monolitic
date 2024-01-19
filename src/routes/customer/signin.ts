import { BadRequestError, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";
import { CustomerService } from "../../services/CustomerService";
import { Password } from "../../utils/password";

const router = express.Router();

router.post(
  "/api/customer/signin",
  CustomerBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await CustomerService.findOne(email);

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials", "message");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials", "message");
    }

    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = { customerJwt: userJWT };
    res.status(201).json(existingUser);
  }
);

export { router as customerSigninRouter };
