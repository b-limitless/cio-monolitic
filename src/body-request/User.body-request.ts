import { body } from "express-validator";

export const UserBodyRequest = [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 to 20 characters'),
      body('role').trim().notEmpty().withMessage('Role must not be empty'),
      body('permissions')
        .isArray({ min: 1 })
        .withMessage('Please provide at least one permission to the user'),
];
