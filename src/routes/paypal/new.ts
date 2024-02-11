import { validateRequest } from '@pasal/common';
import express, { Request, Response } from 'express';
import { AccentBodyRequest } from '../../body-request/accent/Accent.body-request';
import { AccentDoc } from '../../models/accent';
import { AccentService } from '../../services/Accent.Service';
import { PaypalBodyRequest } from '../../body-request/paypal/Paypal.body-request';

const router = express.Router();

router.post(
  '/api/paypal',
  PaypalBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    res.send('hello')
  }
);

export { router as createPaypalRouter };

