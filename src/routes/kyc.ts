import express, { Request, Response } from "express";
import { requireAuth } from "@pasal/common";
import { KYCBodyRequest } from "../body-request/KYC.body-request";
import { KYCService } from "../services/KYC.service";
import logger from "../logger";

const router = express.Router();

router.post(
  "/api/users/kyc",
  KYCBodyRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const {
      industry,
      employeeCount,
      currentWorkFlow,
      currentSoftware,
      painPoint,
      requirements,
      tranningAndSupport,
    } = req.body;

    const userId = req.currentUser?.id;

    

    try {
      const KYC = await KYCService.build({
        userId,
        industry,
        employeeCount,
        currentWorkFlow,
        currentSoftware,
        painPoint,
        requirements,
        tranningAndSupport,
      });
      logger.log("info", "KYC Successfully created", KYC);
      return res.status(201).send(KYC);

    } catch (err) {
      logger.log("error", "Could not create kyc", err);
      res.status(500).send(err);
    }

    
  }
);


export { router as KYCRouter };
