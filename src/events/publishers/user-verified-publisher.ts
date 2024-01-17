import { Subjects, UserCreatedEvent, Publisher, UserVerifiedEvent } from "@pasal/common";

export class UserVerifiedPublisher extends Publisher<UserVerifiedEvent> {
    subject: Subjects.UserVerified = Subjects.UserVerified;
}