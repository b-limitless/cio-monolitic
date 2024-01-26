import express from 'express'; 
import { Request, Response } from 'express';
import { CartService } from '../../services/Cart.Service';
import mongoose from 'mongoose';
const router = express.Router();


router.get('/api/cart', async(req:Request, res:Response) => {
    const customerId = req?.currentCustomer?.id ? new mongoose.Types.ObjectId(req.currentCustomer.id) : null;
    const sessionId = req?.currentCartSession?.id;

    console.log('customer id, session id', customerId, sessionId)

    try {
        const carts = await CartService.find({customerId, sessionId});
        res.json(carts);
    } catch(err) {
        res.sendStatus(500).json(`Could not fetch the carts ${err}`)
    }
});

router.get('/api/cart/all', async(_, res:Response) => {
    
    try {
        const carts = await CartService.find({});
        res.json(carts);
    } catch(err) {
        res.sendStatus(500).json(`Could not fetch the carts ${err}`)
    }
});

export {router as getCartRouter};