import { BadRequestError, validateRequest } from "@pasal/common";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomerBodyRequest } from "../../body-request/customer/Customer.body-request";
import { CustomerService } from "../../services/Customer.Service";
import { Password } from "../../utils/password";
import mongoose from "mongoose";
import { CartService } from "../../services/Cart.Service";
import logger from "../../logger";

const router = express.Router();

router.post(
  "/api/customer/signin",
  CustomerBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    const customerId = req?.currentCustomer?.id
      ? new mongoose.Types.ObjectId(req.currentCustomer.id)
      : null; // or simply say clientCartSession object
    const sessionId = req?.currentCartSession?.id;

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

    // Check if there is cart session is active then update the cart with this id 
    if(sessionId) {
      // Update the cart collection with this customer id 
      const filter = {sessionId};
      const update = {customerId: existingUser.id};
      try {
        await CartService.findByWhereClauseAndUpdate(filter, update, {});
      } catch(err) {
        logger.log('error', `Could not update the cart ${err}`)
        throw new Error(`Could not update the cart ${err}`);
      }
      
    }

    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    if(req.session) {
      req.session.customerJwt = userJWT;
    }
    // req.session = { customerJwt: userJWT };
    res.status(201).json(existingUser);
  }
);

export { router as customerSigninRouter };
