import { UserBodyRequest } from "./User.body-request";
import { body } from "express-validator";

export const TeamBodyRequest = [
    body('firstName').isString().notEmpty().withMessage('First name must be a non-empty string'),
    body('lastName').isString().notEmpty().withMessage('Last name must be a non-empty string'),
    ...UserBodyRequest
]