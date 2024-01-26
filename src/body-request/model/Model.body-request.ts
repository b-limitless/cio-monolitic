import { body } from 'express-validator';
import { ProductType } from '../../models/types';

const validateProductType = (value) => {
  if (!Object.values(ProductType).includes(value)) {
    throw new Error('Invalid product type');
  }
  return;
};

export const ModelBodyRequest = [
  body('type').custom(validateProductType).withMessage('Invalid product type'),
  body('name')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 to 20 characters'),
  body('title')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Password must be between 4 to 20 characters'),
  body('modelURL')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Password must be between 4 to 20 characters'),
  body('price')
    .trim()
    .isNumeric()
    .isLength({ min: 2, max: 20 })
    .withMessage('Password must be between 4 to 20 characters'),
];
