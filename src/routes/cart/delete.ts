import { BadRequestError, NotFoundError } from '@pasal/common';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import logger from '../../logger';
import { CartService } from '../../services/Cart.Service';
import { Cart } from '../../models/cart';

const router = express.Router();

router.delete('/api/cart/:id', async(req:Request, res:Response) => {
    const customerId = req?.currentCustomer?.id ? new mongoose.Types.ObjectId(req.currentCustomer.id) : null; // or simply say clientCartSession object
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

router.delete('/api/cart', async(req:Request, res:Response) => {
    try {
        await Cart.deleteMany();

        res.send('All Cart Items is deleted');
    } catch(err) {

    }
})

export { router as deleteCartRouter };

