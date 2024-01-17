import { NotFoundError } from "@pasal/common";
import logger from "../logger";
import { Verification } from "../models/verification";
 class VerificationServiceLocal {
  async build(data: any) {
    try {
      const verification = Verification.build({ ...data });
      await verification.save();
      return verification;
    } catch (err: any) {
      logger.log("error", `Could not save verification: ${err}`);
      throw new Error(err);
    }
  }

  async find({...query}) {
    const findVerificationCode = await Verification.find({...query});
    return findVerificationCode;

  } 
}

const VerficationService = new VerificationServiceLocal();

export {VerficationService};

