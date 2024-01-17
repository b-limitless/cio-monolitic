import { FebricDeletedEvent, Listener, Subjects } from "@pasal/common";
import { Channel } from "amqplib";
import { FebricService } from "../../services/FebricService";
import mongoose from "mongoose";
import logger from "../../logger";

export class FebricDeletedListener extends Listener<FebricDeletedEvent> {
  subject: Subjects.FebricDeleted = Subjects.FebricDeleted;

  constructor(channel: Channel) {
    super(channel);
  }
  async onMessage(data: FebricDeletedEvent["data"], message: any) {
    let { febricId } = JSON.parse(data as any);

    febricId = new mongoose.Types.ObjectId(febricId);

    // Find and delete one
    try {
      await FebricService.findOneAndDelete({ febricId });
      logger.log("info", `febric is sucessfully deleted with id ${febricId}`);
    } catch (err) {
      logger.log("error", `Could not delete the febric with id ${febricId}`);
    }
  }
}
