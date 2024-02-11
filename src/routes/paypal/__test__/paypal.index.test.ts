import request from "supertest";
import { app } from "../../../app";


it("creates paypal security and client key", async () => {
    const token = global.signin(["create_febric"]);
    const createClientAndSectKey = await request(app)
      .post("/api/paypal")
      .set("Cookie", token)
      .send({ clientId: "sdfsdf", clientSecret: "345334" })
      .expect(200);

      const paypal = await request(app)
      .get("/api/paypal")
      .set("Cookie", token)
      .expect(200);
      const parseResponse = JSON.parse(paypal.text);
      expect(parseResponse.clientId).toEqual('sdfsdf');
  });
  