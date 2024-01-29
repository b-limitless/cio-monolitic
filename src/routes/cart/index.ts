import express from "express";
import { Request, Response } from "express";
import { CartService } from "../../services/Cart.Service";
import mongoose from "mongoose";
import { currentCartSession } from "@pasal/common";
const router = express.Router();
import jwt from 'jsonwebtoken';

router.get("/api/cart", async (req: Request, res: Response) => {
  const customerId = req?.currentCustomer?.id
    ? new mongoose.Types.ObjectId(req.currentCustomer.id)
    : null;
  const sessionId = req?.currentCartSession?.id;

  console.log("customer id, session id", customerId, sessionId);

  try {
    const carts = await CartService.find({ customerId, sessionId });
    res.json(carts);
  } catch (err) {
    res.sendStatus(500).json(`Could not fetch the carts ${err}`);
  }
});

router.get("/api/cart/all", async (_, res: Response) => {
  try {
    const carts = await CartService.find({});
    res.json(carts);
  } catch (err) {
    res.sendStatus(500).json(`Could not fetch the carts ${err}`);
  }
});

router.post("/api/cart/currentCartSession", async (req, res) => {
   res.send(req?.currentCartSession);
});

router.post("/api/cart/setCartSession", async (req, res) => {

    const customerId = req?.currentCustomer?.id
      ? new mongoose.Types.ObjectId(req.currentCustomer.id)
      : null; // or simply say clientCartSession object
    const cartSession = req?.currentCartSession?.id;

    const token = jwt.sign({ id: '3e9acd0d-6ad6-42de-be9d-9873cbfe21d0' }, process.env.JWT_KEY!);

    const shouldSetSession = !customerId && !cartSession;
      if (shouldSetSession) {
        if (req.session) {
          req.session.cart = token;
        }
      }

    res.send(shouldSetSession ? 'Session is set' : token);
 });



export { router as getCartRouter };
