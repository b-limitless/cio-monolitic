import { requireCustomerAuth, validateRequest } from "@pasal/common";
import express, {
    Request, Response
} from "express";
import { ShirtMeasurmeentBodyRequest } from "../../body-request/measurement/shirt/Shirt.measurement.body-request";

const router = express.Router();

router.post(
  "/api/measurement",
  ShirtMeasurmeentBodyRequest,
  validateRequest,
  requireCustomerAuth,
  async (req:Request, res:Response) => {
    // access the customer id throw the session 
    const customerId = req?.currentCustomer?.id;

    try {

        
    } catch(err) {

    }
    res.send();
  }
);
 

export {router as newMeasurementRouter};