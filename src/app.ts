import express from "express";
import "express-async-errors";
import cors from "cors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { signInRouter } from "./routes/auth/signin";
import { signupRouter } from "./routes/auth/signup";
import { signoutRouter } from "./routes/auth/signout";
import { permissionRouter } from "./routes/auth/permission";
import { resetPasswordRouter } from "./routes/auth/reset-password";
import { errorHandler, NotFoundError, currentUser, currentCustomer } from "@pasal/common";
import { currentUserRouter } from "./routes/auth/current-user";
import { verificationRouter } from "./routes/auth/verify";
import { KYCRouter } from "./routes/auth/kyc";
import { profileRouter } from "./routes/auth/profile";
import { teamRouter } from "./routes/auth/team";
import bodyParser from 'body-parser';
import { createFebricRouter } from "./routes/product/new";
import { indexProductRouter } from "./routes/product";
import { showProductRouter } from "./routes/product/show";
import { updateFebricRouter } from "./routes/product/update";
import { uploadeRouter } from "./routes/product/upload";
import { deleteFebricRouter } from "./routes/product/delete";
import { customerSignupRouter } from "./routes/customer/signup";
import { customerSigninRouter } from "./routes/customer/signin";



const app = express();


const isProd = () => {
  return process.env.NODE_ENV === "production";
}

app.use(
  cors({}));

app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: isProd(),
    secure: isProd(),
    domain: process.env.domain || 'pasal.dev',
    maxAge: 3600000 // 10000 * 60 minutes * 60 seconds
  })
);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));


app.use(currentUser);
app.use(currentCustomer);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(resetPasswordRouter);
app.use(permissionRouter);
app.use(verificationRouter);
app.use(KYCRouter);
app.use(profileRouter);
app.use(teamRouter);
app.use(createFebricRouter);
app.use(indexProductRouter);
app.use(showProductRouter);
app.use(updateFebricRouter);
app.use(uploadeRouter);
app.use(deleteFebricRouter);
app.use(customerSignupRouter);
app.use(customerSigninRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError("Route did not find");
});

app.use(errorHandler);

export { app };
