import { FebricCreatedEvent, Listener, Subjects } from "@pasal/common";
import logger from "@pasal/common/build/logger";
import { FebricService } from "../../services/FebricService";

export class FebricCreatedListener extends Listener<FebricCreatedEvent> {
  subject: Subjects.FebricCreated = Subjects.FebricCreated;

  async onMessage(data: FebricCreatedEvent["data"], message: any) {
    const parseData = JSON.parse(data as any);
    try {
      const febric = await FebricService.build(parseData);
      logger.log("info", "Febric has been created");
      logger.log("info", febric.id);
    } catch (err) {
      logger.log("error", "Can not create febric");
    }
  }
}
