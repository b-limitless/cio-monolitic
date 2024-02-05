
import request from "supertest";
import { app } from "../../../app";


const testData = {
    height: 170,
    inch: 5,
    weight: 70,
    age: 25,
    unite: 'cm',
    firstName: 'John',
    lastName: 'Doe'
  };

  
it('If customer is not signed in throw unauthorized error', async() => {
    await request(app).put("/api/customer").send({}).expect(401);
});

it('signin a customer and update the information', async() => {
    const response = await request(app)
    .put("/api/customer")
    .set('Cookie', global.signinCustomer())
    .send(testData).expect(200);

    const {height} = JSON.parse(response.text);

    expect(height).toEqual(170);

});

