import { body } from "express-validator";
import { TFebric } from "../../types/febric";

const validateFebric = (value: TFebric) => {
    // Your custom validation logic for the fabric type
    if (!value || typeof value !== 'object') {
      throw new Error('Invalid Fabric Type');
    }
  
    // Validate specific properties based on your requirements
    // if (typeof value.title !== 'string' || value.title.trim() === '') {
    //   throw new Error('Invalid Fabric Title');
    // }
  
    // if (typeof value.price !== 'number' || isNaN(value.price) || value.price <= 0) {
    //   throw new Error('Invalid Fabric Price');
    // }
  
    // Add more property validations as needed
  
    return true;
  };

export const UpdateQutyBodyRequest = [
    body('originalImageUrl').optional().isString().withMessage("Original Image Url must be a string and must not be empty"),
    body('thumbnailImageUrl').optional().isString().withMessage("Thumbnail Image Url must be a string and must not be empty"),
    body('status').optional().isIn(['open', 'pendingPayment', 'completed']).withMessage("Status must be one of 'open', 'pendingPayment', 'completed'"),
    body('accent').optional().isObject().withMessage("Accent must be an object"),
    body('model').optional().isObject().withMessage("Model must be an object"),
    body('febric').optional().custom(validateFebric),
    body('modelType').optional().isString().withMessage("Model Type must be a string"),
  
    body('subTotal').optional().isNumeric().withMessage("SubTotal must be a number"),
    body('qty').optional().isInt().withMessage("Qty must be an integer"),
    body('discount').optional().isNumeric().withMessage("Discount must be a number"),  // Optional numeric field
    body('availability').optional().isString().withMessage("Availability must be a string"),
    body('id').not().isEmpty().withMessage("ID is required").isInt().withMessage("ID must be an integer"),
    body('deliveryTime').optional().isString().withMessage("Delivery Time must be a string or null"),  // Optional string field that can be null
    body('orderId').optional().isString().withMessage("Order ID must be a string or null"),  // Optional string field that can be null
  ];