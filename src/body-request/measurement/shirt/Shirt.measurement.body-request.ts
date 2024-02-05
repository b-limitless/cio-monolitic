import { body } from "express-validator";

export const ShirtMeasurmeentBodyRequest = [
    body('sleeveLength').optional().isNumeric().withMessage('Sleeve length must be a number'),
    body('shoulderWidth').optional().isNumeric().withMessage('Shoulder width must be a number'),
    body('chestAround').optional().isNumeric().withMessage('Chest around must be a number'),
    body('stomach').optional().isNumeric().withMessage('Stomach must be a number'),
    body('bicepAround').optional().isNumeric().withMessage('Bicep around must be a number'),
    body('torsoLength').optional().isNumeric().withMessage('Torso length must be a number'),
    body('hips').optional().isNumeric().withMessage('Hips must be a number'),
    body('wrist').optional().isNumeric().withMessage('Wrist must be a number'),
    body('neck').optional().isNumeric().withMessage('Neck must be a number'),
];