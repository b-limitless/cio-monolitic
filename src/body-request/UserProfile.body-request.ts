import { body } from "express-validator";

export const UserProfileBodyRequest = [
  body('firstName').optional({ nullable: true }).isString().notEmpty().withMessage('First name must be a non-empty string'),
  body('lastName').optional({ nullable: true }).isString().notEmpty().withMessage('Last name must be a non-empty string'),
  body('country').optional({ nullable: true }).isString().notEmpty().withMessage('Country must be a non-empty string'),
  body('spokenLanguage').optional({ nullable: true }).isArray().withMessage('Please provide at least one spoken language'),
  body('about').optional({ nullable: true }).isString().notEmpty().withMessage('About must be a non-empty string'),
  body('profileImageLink').optional({ nullable: true }).isString().notEmpty().withMessage('Profile image link must be a non-empty string'),
];