import { NotFoundError, currentCustomer, currentUser, errorHandler } from "@pasal/common";
import { currentCartSession } from "./common/current-cart-session";
import bodyParser, { json } from 'body-parser';
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { KYCRouter } from "./routes/auth/kyc";
import { permissionRouter } from "./routes/auth/permission";
import { profileRouter } from "./routes/auth/profile";
import { resetPasswordRouter } from "./routes/auth/reset-password";
import { signInRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";
import { teamRouter } from "./routes/auth/team";
import { verificationRouter } from "./routes/auth/verify";
import { currentCustomerRouter } from "./routes/customer/current-customer";
import { customerSigninRouter } from "./routes/customer/signin";
import { customerSignupRouter } from "./routes/customer/signup";
import { indexProductRouter } from "./routes/product";
import { deleteFebricRouter } from "./routes/product/delete";
import { createFebricRouter } from "./routes/product/new";
import { showProductRouter } from "./routes/product/show";
import { updateFebricRouter } from "./routes/product/update";
import { uploadeRouter } from "./routes/product/upload";
import { currentUserRouter } from "./routes/auth/current-user";
import { createModelRouter } from "./routes/model/new";
import { createAccentRouter } from "./routes/accent/new";
import { updateCartRouter } from "./routes/cart/update";
import { createCartRouter } from "./routes/cart/new";
import { deleteCartRouter } from "./routes/cart/delete";



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
    // domain: process.env.domain || 'pasal.dev',
    maxAge: 3600000 // 10000 * 60 minutes * 60 seconds
  })
);
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));


app.use(currentUser);
app.use(currentCustomer);
app.use(currentCartSession);
app.use(currentCustomerRouter);
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
app.use(createModelRouter);
app.use(createAccentRouter);
app.use(createCartRouter);
app.use(updateCartRouter);
app.use(deleteCartRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route did not find");
});

// app.use(errorHandler);

export { app };
