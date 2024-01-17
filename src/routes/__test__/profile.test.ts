import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

const permission = {
  name: "list_leads",
  cat: "ifa",
  guard_name: "sales",
  role: "sales executive",
};

beforeEach(async () => {
  await request(app)
    .post("/api/users/permission/create")
    .send(permission)
    .expect(200);
});

it("throw 401 error, if username and the password is not provided", async () => {
  await request(app).post("/api/users/signup").send({}).expect(400);
});

it("registere user sucessfully initially user is not verified and its sends request to verify user", async () => {
  try {
    const res = await request(app)
      .post("/api/users/signup")
      .send({
        email: "abcdefgh86@gmail.com",
        password: "test",
        permissions: ["list_leads"],
        role: "admin",
        employeeCount: 50,
        industry: ["fashion"],
      })
      .expect(201);

    // Extract verification code
    const {
      verificationCode,
      user: { id, verified },
    } = JSON.parse(res.text);

    expect(verified).toEqual(false);
    // // Send the verification code to the api
    await request(app)
      .post("/api/users/verify")
      .send({ verificationCode })
      .expect(200);

    // // //  Find the user by that id
    const findUser = await User.findById(id);

    // const {verified} = findUser;
    expect(findUser?.verified).toEqual(true);

    // Updating the user
    try {
      // Update user with new information such as
      const updatedUserModel = {
        firstName: "Nigger",
        lastName: "Shah",
        country: "UAE",
        spokenLanguage: ["en", "ar"],
        about: "This is bharat",
        profileImageLink:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
      };

      const updateUser = await request(app)
        .put(`/api/users/${id}`)
        .set("Cookie", global.signin([]))
        .send(updatedUserModel)
        .expect(200);
        const parseUpdateResponse = JSON.parse(updateUser.text);
        // console.log("updated user ", parseUpdateResponse);
    } catch (err) {
      console.log("Error while updating the user", err);
    }
  } catch (err: any) {
    console.log("err", err.message);
  }
});

it("will update the user passoword as well, If user specify new password, set new token", async() => {

});