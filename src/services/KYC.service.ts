import logger from "../logger";
import { KYC } from "../models/kyc";

export class KYCServiceLocal {
  async build(data: any) {
    try {
      const buildKYC = KYC.build({ ...data });
      await buildKYC.save();

      return buildKYC;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: any) {
    try {
      const updated = await KYC.findByIdAndUpdate(id, update, options);
      return updated;
    } catch (err) {
      throw new Error(`Can not find and update`);
    }
  }
}

const KYCService = new KYCServiceLocal();

export { KYCService };
