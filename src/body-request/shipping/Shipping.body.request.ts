import { body } from "express-validator";

export const ShippingBodyRequest = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('addressLine1').notEmpty().withMessage('Address Line 1 is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('postalCode').notEmpty().withMessage('Postal code is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('countryCode').notEmpty().withMessage('Country code is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address'),
  ];