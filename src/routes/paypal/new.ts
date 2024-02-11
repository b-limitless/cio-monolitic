import { NotAuthorizedError, requireAuth, validateRequest } from '@pasal/common';
import express, { Request, Response } from 'express';
import { AccentBodyRequest } from '../../body-request/accent/Accent.body-request';
import { AccentDoc } from '../../models/accent';
import { AccentService } from '../../services/Accent.Service';
import { PaypalBodyRequest } from '../../body-request/paypal/Paypal.body-request';
import { PaypalService } from '../../services/Paypal.service';
import mongoose from 'mongoose';
import logger from '../../logger';

const router = express.Router();

router.post(
  '/api/paypal',
  requireAuth,
  PaypalBodyRequest,
  validateRequest,

  async (req: Request, res: Response) => {
    const userId = new mongoose.Types.ObjectId(req?.currentUser?.id);// or simply say clientCartSession object

   const {clientId, clientSecret} = req.body;

   try {
     const paypal = await PaypalService.build({userId, clientId, clientSecret});
     res.json(paypal);
   } catch(err) {
    logger.log('error', `Could not create paypal client and secret key`);
    throw new Error(`Could not create paypal client and secret key`);
   }
  }
);

export { router as createPaypalRouter };

