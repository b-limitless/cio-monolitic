import mongoose from "mongoose";
import logger from "../logger";
import { Style, StyleDoc } from "../models/style";

export class ModelServiceLocal {
    async findOne(id:string ) {
        const existingModel = await Style.findOne({ id });
        return existingModel;
    }

    async build(data:StyleDoc) {
        try {
            const model =  Style.build({...data});
            await model.save();
            return Style;
        } catch (err:any) {
            logger.log("error", `Could not save Style: ${err}`);
            throw new Error(err);
        }
    }

    async findByIdAndUpdate(id:string, update:any, options:any) {
        try {
            const updated = await Style.findByIdAndUpdate(id, update, options);
            
            return updated;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findById(id:string) {
        try {
            const find = await Style.findByIdAndUpdate(id)
            return find;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findByWhereCluse(data:any) {
        try {   
            const find = await Style.findOne({...data}); 
            return find;
        } catch(err:any) {
            throw new Error(err.message);
        }
    }

    async deleteOne(id:string) {
        try {
            await Style.deleteOne({_id: new mongoose.Types.ObjectId(id)});
        } catch(err) {
            logger.log("info", `Can not delete Style ${err}`);
            throw new Error(`Can not delete Style ${err}`);
        }
    }
}

const ModelService = new ModelServiceLocal();

export { ModelService };
