import { Subjects, UserCreatedEvent, Publisher } from "@pasal/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    subject: Subjects.UserCreated = Subjects.UserCreated;
}