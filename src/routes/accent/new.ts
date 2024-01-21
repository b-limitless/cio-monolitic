import { validateRequest } from '@pasal/common';
import express, { Request, Response } from 'express';
import { AccentBodyRequest } from '../../body-request/accent/Accent.body-request';
import { AccentDoc } from '../../models/accent';
import { AccentService } from '../../services/Accent.Service';

const router = express.Router();

router.post(
  '/api/accent',
  AccentBodyRequest,
  validateRequest,
  async (req: Request, res: Response) => {
    const { type, partName, price, febric, meshName  } = req.body;

    console.log('req.body', req.body)

    const buildModel = await AccentService.build({type, partName, price, febric, meshName} as AccentDoc);

    res.status(201).send(buildModel);
  }
);

export { router as createAccentRouter };

