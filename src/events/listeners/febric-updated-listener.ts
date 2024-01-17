import { FebricUpdatedEvent, Listener, Subjects } from "@pasal/common";
import logger from "@pasal/common/build/logger";
import mongoose from "mongoose";
import { FebricService } from "../../services/FebricService";

export class FebricUpdatedListener extends Listener<FebricUpdatedEvent> {
  subject: Subjects.FebricUpdated = Subjects.FebricUpdated;
  async onMessage(data: FebricUpdatedEvent["data"], message: any) {
    const parseData = JSON.parse(data as any);
    let { febricId, ...rest } = parseData;

    febricId = new mongoose.Types.ObjectId(febricId);

    try {
      const updtaedFebric = await FebricService.findOneAndUpdate(
        { febricId },
        { ...rest },
        { new: true }
      );
      logger.log("info", "Febric has been successfully updated");
      logger.log("info", updtaedFebric);
    } catch (err) {
      logger.log("error", `Could not updated febric with id ${febricId}`);
    }
  }
}
