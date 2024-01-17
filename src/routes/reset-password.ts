import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@pasal/common";
import { User } from "../models/user";
import { ResetPassword } from "../models/resetpassword";
import mongoose from "mongoose";
import { Password } from "../utils/password";
import { UserService } from "../services/User.service";
import { PasswordService } from "../services/PasswordService";
import logger from "@pasal/common/build/logger";
import { readFile } from "../utils/readFile";
import { sendMail } from "../mailar";
import { mailerEmail } from "../config/email";
import { messages } from "../messages";
const router = express.Router();

router.post(
  "/api/users/reset-password/request",
  [body("email").isEmail().withMessage("Please provide email address")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await UserService.findByWhereCluse({ email, verified: true });

    if (!user) {
      logger.log("info", `User was not found with email ${email}`);
      return res.status(201).send(true);
    }
    const passwordReset = await PasswordService.build({
      user_id: user.id,
      code: new mongoose.mongo.ObjectId().toHexString(),
    });

    // For testing we need code
    res.status(201).send(passwordReset);
    

    let {firstName, id} = user;

    firstName = firstName || "Customer"

    // Send main to the user for reseting password

    const resetPasswordLink = (process.env.BASE_DOMIN_URI || "") + process.env.RESET_PASSWORD + `/${passwordReset.code}/${id}`;
  
    try {
      const getResetPasswordLinkTemplate = await readFile("request-reset-password.html", {firstName, resetPasswordLink}); 
      const sendResetPasswordEmail = await sendMail({
        from: mailerEmail,
        to: email,
        subject: "Reset password",
        text: "",
        html: getResetPasswordLinkTemplate,
      });
      logger.log("info", messages.resetPasswordMessage, sendResetPasswordEmail );
    } catch (err:any) {
      logger.log("error", err);
      throw new Error(err);
    }
  }
);

router.patch(
  "/api/users/reset-password/request",
  [
    body("code")
      .isLength({ min: 24, max: 24 })
      .withMessage("Please provide valid id"),
    body("user_id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Please provide valid id"),
    body("password")
      .isLength({ min: 4, max: 28 })
      .withMessage("Please enter the password")
      .custom((value, { req, path }) => {
        if (value !== req.body.confirmPassword) {
          throw new BadRequestError("Both password did not match");
        } else {
          return true;
        }
      }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code, user_id, password } = req.body;

    const isValid = await ResetPassword.findOne({
      user_id: user_id,
      code: code,
      expire_at: { $lt: new Date() },
    });

    if (isValid) {
      throw new BadRequestError(`Invalid code or code has been expired`);
    }

    const user = await User.findById(user_id);

    if (!user) {
      throw new BadRequestError("Unable find the user");
    }

    const hashedPassword = await Password.toHash(password);

    try {
      const updatePassword = await User.findOneAndUpdate(
        { _id: user_id },
        { $set: { password: hashedPassword } },
        { new: true, useFindAndModify: false }
      );
      if (!updatePassword) {
        throw new Error(`Unable to update the password`);
      }
      return res.status(200).json({ message: "Password updated sucessfully" });
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
);

export { router as resetPasswordRouter };
