import { body } from "express-validator";
import { ProductPartNames, ProductType } from "../../models/types";

export const StyleBodyValidator = [
  body("type")
    .isIn(Object.values(ProductType))
    .withMessage("Invalid product type"),

  body("partName")
    .isIn(Object.values(ProductPartNames))
    .withMessage("Invalid product part name"),

  body("price").isNumeric().withMessage("Price must be a numeric value"),

  body("code").isString().withMessage("Code must be a string"),

  body("label").isString().withMessage("Label must be a string"),

  body("modelURL").isString().withMessage("Model must be a string"),
  body("mediaUrl").isString().withMessage("Media URL is required"),
];
