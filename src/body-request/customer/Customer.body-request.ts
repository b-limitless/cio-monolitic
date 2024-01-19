import { body } from "express-validator";

export const CustomerBodyRequest = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 to 20 characters"),
];
