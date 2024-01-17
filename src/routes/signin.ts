import {
  BadRequestError,
  validateRequest
} from "@pasal/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { UserService } from "../services/User.service";
import { Password } from "../utils/password";
const router = express.Router();
import { User } from "../models/user";


router.get('/.well-known/acme-challenge/Qw44UC4TanKFd2ii3P2N1DVZESvyV-nML-XbmsXCjnk', (req, res) => {
  res.send('ok')
})
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email,
      verified: true,
    }).populate("permissions");

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
        permission: existingUser.permissions,
        role: existingUser.role,
      },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJWT };
    res.status(201).json(existingUser);
  }
);


export { router as signInRouter };
