/**
 * When user is not authenticated then we basically create a session and store 
 * that session key as user id, We can not inforce client to login to add product to the cart
 * 
 * We are checking in this case that if customer is authenicated or we create the sesion for the user   
 * **/
import { requireCustomerAuth, validateRequest } from '@pasal/common';
import { Cart } from '../../models/cart';
import { Request, Response } from 'express';
import express from 'express';
import { CartBodyRequest } from '../../body-request/cart/Cart.body.request';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post(
'/api/cart', 
// CartBodyRequest,
validateRequest,
// requireCustomerAuth,
async(req:Request, res:Response) => {
    const curtomerId = req?.currentCustomer?.id; // or simply say clientCartSession object
    const cartSession = req?.currentCartSession?.id;
    

    // If both customer session and cart session is not set
    // Then we need to set a session for that customer without login
    // Based on the client 
    if(!curtomerId && !cartSession) {
        const token = jwt.sign({id: 1}, process.env.JWT_KEY!);
        console.log('Setting up token instially')

        if(req.session) {
            req.session.cart = token;
        }
    } 
    
    // console.log('cartSession', cartSession)
    // res.sendStatus(200).json(cartSession);
    res.send(req?.currentCartSession)
});

export {router as CreateCartRouter};