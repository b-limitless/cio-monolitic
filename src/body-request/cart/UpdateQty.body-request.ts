import { body } from "express-validator";
import { TFebric } from "../../types/febric";


export const UpdateQutyBodyRequest = [
    body('id').isString().withMessage("Original Image Url must be a string and must not be empty"),
    body('subTotal').isNumeric().withMessage("SubTotal must be a number"),
    body('qty').isInt().withMessage("Qty must be an integer"),
];
