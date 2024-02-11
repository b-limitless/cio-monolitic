import { body } from "express-validator";

export const PaypalBodyRequest = [
  body("clientId")
    .isString()
    .notEmpty()
    .withMessage("Client Id must be a non-empty string"),
  body("clientSecret")
    .isString()
    .notEmpty()
    .withMessage("Client secret must be a non-empty string"),
];
