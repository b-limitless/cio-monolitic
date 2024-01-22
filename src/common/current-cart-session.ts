import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CartSesssionPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentCartSession?: CartSesssionPayload;
    }
  }
}

export const currentCartSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.cart) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.cart,
      process.env.JWT_KEY!
    ) as CartSesssionPayload;
    req.currentCartSession = payload;
  } catch (err) {
    console.log(err);
  }
  next();
};
