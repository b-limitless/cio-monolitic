import { Subjects, Publisher, ProfileUpdatedEvent } from "@pasal/common";

export class UserProfileUpdatedPublisher extends Publisher<ProfileUpdatedEvent> {
    subject: Subjects.ProfileUpdated = Subjects.ProfileUpdated;
}