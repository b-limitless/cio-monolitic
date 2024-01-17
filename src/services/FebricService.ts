import { Febric } from "../models/febric";

export class FebricServiceLocal {
  async findById(id: string) {
    const existingUser = await Febric.findById(id);

    return existingUser;
  }

  async build(data: any) {
    try {
      const febric = Febric.build({ ...data });
      await febric.save();
      return febric;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async findByIdAndDelete(id: string) {
    try {
      await Febric.findByIdAndDelete(id);
    } catch (err:any) {
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await Febric.findByIdAndUpdate(id, update, options);
      return updated;
    } catch (err:any) {
      throw new Error(err);
    }
  }

  async findOneAndDelete(filter: any) {
    try {
      const deleteFebric = await Febric.findOneAndDelete(filter);
      return deleteFebric;
    } catch (err:any) {
      throw new Error(err);
    }
  }

  async findOneAndUpdate(filter: any, update: any, options: any) {
    try {
      const updatedFebric = await Febric.findOneAndUpdate(
        filter,
        update,
        options
      );
      return updatedFebric;
    } catch (err:any) {
        throw new Error(err);
    }
  }
}

const FebricService = new FebricServiceLocal();

export { FebricService };
