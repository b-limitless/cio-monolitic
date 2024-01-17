import 'dotenv/config';
import { app } from "./app";
import mongoose from "mongoose";
import logger from "./logger";
import connectToRabbitMQ from "@pasal/common/build/rabbitmq/connection";
import { rabbitMQWrapper } from "@pasal/common";
import { FebricCreatedListener } from "./events/listeners/febric-created-listener";
import { FebricDeletedListener } from "./events/listeners/febric-deleted.listener";
import { FebricUpdatedListener } from "./events/listeners/febric-updated-listener";

const start = async () => {
 
  if (!process.env.JWT_KEY) {
    logger.log({
      level: "error",
      message: "JWT key must be defined"
    });
    throw new Error("JWT key must be defined");
  }
  if (!process.env.MONGO_URI) {
    logger.log({
      level: "error",
      message: "MONGO_URI must be defined"
    });
    throw new Error("MONGO_URI must be defined");
  }


  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.log({
      level: "info",
      message: "connected to mongod"
    });
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error while connecting with MongoDB:${error}`
    });
  }
  
};

start();

app.listen(3000, () => {
  logger.log({
    level: "info",
    message: `Hello world, Listening on port 3000`
  });
});
