import { BadRequestError, NotFoundError } from '@pasal/common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import logger from '../../logger';
import { CartService } from '../../services/Cart.Service';

const router = express.Router();

router.delete('/api/cart/:id', async(req:Request, res:Response) => {
    const customerId = new mongoose.Types.ObjectId(req?.currentCustomer?.id) ?? null; // or simply say clientCartSession object
    const sessionId = req?.currentCartSession?.id;
    const id = new mongoose.Types.ObjectId(req.params.id);
    
    // validate this is mongoose id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid cart id provided');
    }

    const filter = {_id: id, customerId, sessionId};

    const cart = await CartService.deleteOneByWhereClause(filter);

    if(!cart) {
        throw new NotFoundError('Unable to find the cart');
    }

    try {
         const deleteCart = await CartService.deleteOneByWhereClause(filter);

         res.json(deleteCart);
    } catch(error:any) {
        logger.log('error', `Could not delete cart ${error}`);
        throw new Error(`Could not delete cart ${error}` )
    }
});

export { router as deleteCartRouter };

