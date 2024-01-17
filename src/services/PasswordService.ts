import { ResetPassword } from "../models/resetpassword";

export default class PasswordServiceLocal {
  async build(data: any) {
    try {
      const requestResetPassword = ResetPassword.build({ ...data });
      await requestResetPassword.save();
      return requestResetPassword;
    } catch (err: any) {
      throw new Error(err);
    }
  }
}

const PasswordService = new PasswordServiceLocal();

export { PasswordService };
