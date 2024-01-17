import mongoose from "mongoose";
import logger from "../logger";
import { User, UserAttrs } from "../models/user";
import { NotFoundError } from "@pasal/common";

export class UserServiceLocal {
    async findOne(email:string ) {
        const existingUser = await User.findOne({ email });
        return existingUser;
    }

    async build(data:any) {
        try {
            const user =  User.build({...data});
            await user.save();
            return user;
        } catch (err:any) {
            logger.log("error", `Could not save user: ${err}`);
            throw new Error(err);
        }
    }

    async findByIdAndUpdate(id:string, update:any, options:any) {
        try {
            const updated = await User.findByIdAndUpdate(id, update, options);
            
            return updated;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findById(id:string) {
        try {
            const user = await User.findByIdAndUpdate(id)
            return user;
        } catch(err) {
            logger.log("info", `Can not find and update`);
            throw new Error(`Can not find and update`);
        }
    }

    async findByWhereCluse(data:any) {
        try {   
            const user = await User.findOne({...data}); 
            return user;
        } catch(err:any) {
            throw new Error(err.message);
        }
    }

    async deleteOne(id:string) {
        try {
            await User.deleteOne({_id: new mongoose.Types.ObjectId(id)});
        } catch(err) {
            logger.log("info", `Can not delete user ${err}`);
            throw new Error(`Can not delete user ${err}`);
        }
    }
}

const UserService = new UserServiceLocal();

export {UserService};