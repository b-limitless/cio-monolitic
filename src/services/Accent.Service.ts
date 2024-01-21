import mongoose from 'mongoose';
import logger from '../logger';

import { AccentDoc, Accent } from '../models/accent';

export class AccentServiceLocal {
  async findOne(id: string) {
    const existingAccent = await Accent.findOne({ id });
    return existingAccent;
  }

  async build(data: AccentDoc) {
    try {
      const accent = Accent.build({ ...data });
      await accent.save();
      return accent;
    } catch (err: any) {
      logger.log('error', `Could not save Accent: ${err}`);
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await Accent.findByIdAndUpdate(id, update, options);

      return updated;
    } catch (err) {
      logger.log('info', `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findById(id: string) {
    try {
      const find = await Accent.findByIdAndUpdate(id);
      return find;
    } catch (err) {
      logger.log('info', `Can not find and update`);
      throw new Error(`Can not find and update`);
    }
  }

  async findByWhereCluse(data: any) {
    try {
      const find = await Accent.findOne({ ...data });
      return find;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async deleteOne(id: string) {
    try {
      await Accent.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    } catch (err) {
      logger.log('info', `Can not delete Accent ${err}`);
      throw new Error(`Can not delete Accent ${err}`);
    }
  }
}

const AccentService = new AccentServiceLocal();

export { AccentService };
