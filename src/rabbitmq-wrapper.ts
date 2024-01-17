import amqp, { Channel, Connection } from "amqplib";
import logger from "./logger";

class RabbitMQWrapper {
  private _client?: Channel;
  private _connnection?:Connection;

  get client() {
    if(!this._client) {
      let msg = "Rabbit MQ client is not avaialble";
      logger.log({
        level: 'error',
        message: msg
      });
      throw new Error(msg);
    }

    return this._client;
  }

  async connect() {
    try {
      if(!process.env.RABBIT_MQ_URL) {
        let msg = "Rabbit MQ url is not provided";
        logger.log({
          level: 'error',
          message: msg
        });
        throw new Error(msg);
        
      }

      this._connnection = await amqp.connect(process.env.RABBIT_MQ_URL);
      this._connnection.on("close", () => {
        logger.log({
          level: 'info',
          message: "Connection to RabbitMQ is closed"
        });
        this._client = undefined;
      })
      this._client = await this._connnection.createChannel();
      logger.log({
        level: 'info',
        message: 'connected to Rabbit'
      });
     } catch(err) {
      logger.log({
        level: 'error',
        message: `Failed to connect to Rabbit MQ ${err}`, 
      });
    }
  }

  async close() {
    try {
      if (this._client) {
        await this._client.close();
      }
      if(this._connnection) {
        await this._connnection.close();
      }
      logger.log({
        level: 'info',
        message: "Disconnected from Rabbit MQ"
      });
    } catch(err){
      logger.log({
        level: 'info',
        message: `Error while closing Rabbit MQ connection ${err}`
      });
    }
      
  }
}

export const rabbitMQWrapper = new RabbitMQWrapper();
