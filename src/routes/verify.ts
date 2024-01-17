import { Request, Response } from "express";
import { Verification } from "../models/verification";
import { Router } from "express";
import { VerificationBodyRequest } from "../body-request/Verification.body-request";
import { NotFoundError, rabbitMQWrapper, validateRequest } from "@pasal/common";
import { VerficationService } from "../services/Verification.service";
import { User } from "../models/user";
import logger from "../logger";
import jwt from "jsonwebtoken"; 
import { UserVerifiedPublisher } from "../events/publishers/user-verified-publisher";
const router = Router();

/**
 * @api {post} /user/:id Get User Information
 * @apiName GetUser
 * @apiGroup Users
 *
 * @apiParam {Number} verification code.
 * @apiParam {String} id User's unique ID.
 *
 * @apiSuccess {Boolean}.
 */

router.post("/api/users/verify", 
VerificationBodyRequest, 
validateRequest,
async(req:Request, res:Response) => {
    const {verificationCode} = req.body;
    const getVerficationCode = await Verification.findOne({verificationCode});
    
    if(!getVerficationCode) {
        throw new NotFoundError("Unable to find verification code");
    }

    // getVerficationCode will contain userId file 
    // Find the user with that Id 
    // Update verify into true
    const {userId} = getVerficationCode;

    try {
        const user = await User.findByIdAndUpdate(userId, {verified: true}, {new: true}).populate('permissions');

        if(!user) {
            throw new NotFoundError("Unable find the user");
        }
        const userJWT = jwt.sign(
            {
              id: user.id,
              email: user.email,
              permissions: user.permissions,
              role: user.role,
            },
            process.env.JWT_KEY!
          );
        
          req.session = {
            jwt: userJWT,
        };

        // Using token in header for the testing purpose
        
        //  PUblish the event that use is verified
        try {
            new UserVerifiedPublisher(rabbitMQWrapper.client).publish({
                userId: user.id
            });
            logger.log("info", `User verified event has been published`);
        } catch(err) {
            logger.log("error", "Could not pulish the verify user event")
        }
        logger.log("info", `User successfully verified`);
        res.send(user);
        return;
    } catch(err) {
        logger.log("error", "Unable to update the user ")
    }
    res.send({});
});


export {router as verificationRouter};
