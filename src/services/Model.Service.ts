import mongoose from "mongoose";
import logger from "../logger";
import { Model, ModelDoc } from "../models/model";

export class ModelServiceLocal {
    async findOne(id:string ) {
        const existingModel = await Model.findOne({ id });
        return existingModel;
    }

    async build(data:ModelDoc) {
        try {
            const model =  Model.build({...data});
            await model.save();
            return Model;
        } catch (err:any) {
            logger.log("error", `Could not save Model: ${err}`);
            throw new Error(err);
        }
    }

    async findByIdAndUpdate(id:string, update:any, options:any) {
        try {
            const updated = await Model.findByIdAndUpdate(id, update, options);
            
            return updated;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findById(id:string) {
        try {
            const find = await Model.findByIdAndUpdate(id)
            return find;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findByWhereCluse(data:any) {
        try {   
            const find = await Model.findOne({...data}); 
            return find;
        } catch(err:any) {
            throw new Error(err.message);
        }
    }

    async deleteOne(id:string) {
        try {
            await Model.deleteOne({_id: new mongoose.Types.ObjectId(id)});
        } catch(err) {
            logger.log("info", `Can not delete Model ${err}`);
            throw new Error(`Can not delete Model ${err}`);
        }
    }
}

const ModelService = new ModelServiceLocal();

export { ModelService };
