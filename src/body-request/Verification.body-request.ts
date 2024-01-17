import { body } from "express-validator";

export const VerificationBodyRequest = [
  body("verificationCode")
  .isLength({ min: 5 })
    .withMessage("Vericiation code is required"),
];
