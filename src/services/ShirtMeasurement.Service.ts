import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import logger from '../logger';



import {ShirtMeasurement, ShirtMeasurementAttrs, ShirtMeasurementDoc} from '../models/shirt-measurement';

export class ShirtMeasurementServiceLocal {
  async findOne(id: string) {
    const existingAccent = await ShirtMeasurement.findOne({ id });
    return existingAccent;
  }

  async build(data: ShirtMeasurementAttrs) {
    try {
      const accent = ShirtMeasurement.build({ ...data });
      await accent.save();
      return accent;
    } catch (err: any) {
      logger.log('error', `Could not save ShirtMeasurement: ${err}`);
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await ShirtMeasurement.findByIdAndUpdate(id, update, options);

      return updated;
    } catch (err) {
      logger.log('info', `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findById(id: string) {
    try {
      const find = await ShirtMeasurement.findByIdAndUpdate(id);
      return find;
    } catch (err) {
      logger.log('info', `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findByWhereCluse(data: any) {
    try {
      const find = await ShirtMeasurement.findOne({ ...data });
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(id: string) {
    try {
      await ShirtMeasurement.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (err) {
      logger.log('info', `Can not delete ShirtMeasurement ${err}`);
      throw new Error(`Can not delete ShirtMeasurement ${err}`);
    }
  }

  async findOneAndUpdateOrInsert(filter:FilterQuery<any>, update:UpdateQuery<any>, options:any) {
    try {
        const updated = await ShirtMeasurement.findOneAndUpdate(filter, update, {...options, upsert: true, new: true, runValidators: true});
        return updated;
      } catch (err) {
        logger.log('info', `Can not find and update`);
        throw new Error(`Can not find and update`);
      }
  }
}

const ShirtMeasurementService = new ShirtMeasurementServiceLocal();

export { ShirtMeasurementService };
