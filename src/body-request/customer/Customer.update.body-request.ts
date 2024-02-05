import { body } from "express-validator";

export const CustomerUpdateBodyRequest = [
  body("height").optional().isNumeric().withMessage("Height must be a number"),
  body("inch").optional().isNumeric().withMessage("Inch must be a number"),
  body("weight").optional().isNumeric().withMessage("Weight must be a number"),
  body("age").optional().isNumeric().withMessage("Age must be a number"),
  body("unite")
    .optional()
    .isIn(["cm", "feet"])
    .withMessage('Unite must be either "cm" or "feet"'),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
];
