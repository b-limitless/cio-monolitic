import { body } from 'express-validator';
import { ProductType } from '../../models/types';


// type: ProductType;
//   partName: ProductPartNames;
//   price: number;
//   febric:string;
//   meshName: string[];

const validateProductType = (value) => {
  console.log(value,Object.values(ProductType) )
  if (!Object.values(ProductType).includes(value)) {
    throw new Error('Invalid product type');
  }
  return true;
};


const validedStringArray = (value) => {
  if(!value.every((item) => typeof item === 'string')) {
    throw new Error('All mesh name must be string')
  }
  return value;
};

export const AccentBodyRequest = [
  body('type').custom(validateProductType).withMessage('Invalid product type'),
  body('partName')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Please provide part name'),
  body('price')
    .isNumeric()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Please provide price'),
  body('febric')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Please provide febric for the accent'),
  body('meshName')
    .isArray()
    .customSanitizer(validedStringArray)
    .withMessage('Mesh name must be an array type'),
];
