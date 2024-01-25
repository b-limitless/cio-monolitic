import { validateRequest } from '@pasal/common';
import express from 'express';
import { Request, Response } from 'express';
import { StyleBodyValidator } from '../../body-request/style/Style.body-request';
const router = express.Router();

router.post('/api/style', 
StyleBodyValidator,
validateRequest,
async(req:Request, res:Response) => {
    res.send();
});

export {router as createStyleRouter};