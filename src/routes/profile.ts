import {
  BadRequestError,
  NotFoundError,
  rabbitMQWrapper,
  requireAuth,
  validateRequest,
} from "@pasal/common";
import logger from "@pasal/common/build/logger";
import express, { Request, Response } from "express";
import { UserProfileBodyRequest } from "../body-request/UserProfile.body-request";
import { UserService } from "../services/User.service";
import { UserProfileUpdatedPublisher } from "../events/publishers/profile-updated-publisher";
import { Password } from "../utils/password";
import jwt from "jsonwebtoken";
import { User, UserAttrs } from "../models/user";

const router = express.Router();

router.put(
  "/api/users/v1/:id?",
  UserProfileBodyRequest,
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      country,
      spokenLanguage,
      about,
      profileImageLink,
      permissions,
      originalImageUrl,
      thumbnailImageUrl,
      password,
      confirmPassword,
    } = req.body;

    // While updating form api could receive password update request as well
    if (password && password !== confirmPassword) {
      throw new BadRequestError("Both password did not matched", "password");
    }

    const optionalField: { [x: string]: any } = {};
    if (password && password === confirmPassword) {
      optionalField.password = await Password.toHash(password);
    }
    //   process.env.NODE_ENV !== "test" ? req?.currentUser?.id : req.params.id;
    const id = req.params.id;

    if (!id) {
      throw new BadRequestError("No authenticated user found");
    }

    try {
      const findAndUpdate:any = await UserService.findByIdAndUpdate(
        id,
        {
          firstName,
          lastName,
          country,
          spokenLanguage,
          about,
          permissions,
          originalImageUrl,
          thumbnailImageUrl,
          ...optionalField,
        },
        { new: true }
      )!;

      if(!findAndUpdate) {
        throw new NotFoundError('Could not find user and update');
      }

      // If password is updated then we need to update the JWT cookie
      if (password ) {
        const userJWT = jwt.sign(
          {
            id,
            email: findAndUpdate?.email,
            permissions: findAndUpdate?.permissions,
            role: findAndUpdate?.role,
          },
          process.env.JWT_KEY!
        );

        req.session = {
          jwt: userJWT,
        };
      }

      res.send(findAndUpdate);
      // Pulish the event that profile is updated

      try {
        new UserProfileUpdatedPublisher(rabbitMQWrapper.client).publish({
          userId: id,
          firstName,
          lastName,
          country,
          spokenLanguage,
          about,
          profileImageLink,
        });
      } catch (err) {
        logger.log("error", "Could not publish profile updated event");
      }
    } catch (err) {
      logger.log(
        "error",
        `An error occurred while processing your request. ${err}`
      );
      res
        .status(500)
        .send({ message: "An error occurred while processing your request." });
    }
  }
);

export { router as profileRouter };
