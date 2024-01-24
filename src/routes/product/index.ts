import express, { Request, Response } from 'express';
import { Febric } from "../../models/febric";
import mongoose from 'mongoose';
import { BadRequestError } from '@pasal/common';

const router = express.Router();
const limit = 20;




router.get("/api/products/v1/:userId", async(req: Request, res:Response) => {
    let page = Number(req.query.page) ?? 0 ;
    
    const userId = new mongoose.Types.ObjectId(req.params.userId) ?? null;

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError('Invalid user id');
    }

    if(page > 0) {
        page = page - 1;
    }
    
    const filters = req?.query?.filters ? JSON.parse(req.query.filters as string) : {};

    const filterQuery:any = {};

    Object.keys(filters).map((key) => {
        if(filters[key].length > 0) {
            filterQuery[key] = {$in: filters[key]};
        }
        
    });
   
    if(userId) {
        filterQuery.userId = userId;
    }
    const affectedRows = await Febric.countDocuments(filterQuery);
    const febrics = await Febric.find(filterQuery, {}).skip(Number(page) * limit).limit(limit);
    
    res.json({febrics, affectedRows, limit});
});

export { router as indexProductRouter };