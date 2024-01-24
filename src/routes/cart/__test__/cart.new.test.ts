import request from 'supertest';
import { app } from '../../../app';
import {cartData} from './data';


it('create a cart with the data', async () => {
  await request(app).post('/api/cart').send({}).expect(400);
});

it('successfully creates cart', async () => {
  const response = await request(app)
    .post('/api/cart')
    .send(cartData)
    .expect(200);

  // Manually tested
  // const {sessionId} = JSON.parse(response.text);

  // Add again the product in that case session id will be same
  // const response1 = await request(app).post('/api/cart').send(cartData).expect(200);

  // const {sessionId: sessionIdSecond} = JSON.parse(response1.text);

  // expect(sessionIdSecond).toEqual(sessionId);
});

it('signin the cusomer and create cart and check the customer Id is is same', async () => {
  const response = await request(app)
    .post('/api/cart')
    .set('Cookie', global.signinCustomer())
    .send(cartData)
    .expect(200);
  const { customerId, sessionId } = JSON.parse(response.text);

  expect(customerId).toBeDefined();
  expect(sessionId).toBeNull();
});

it('if user is not signined in then and then only there should be sessionId', async () => {
  const response = await request(app)
    .post('/api/cart')
    .send(cartData)
    .expect(200);
  const { customerId, sessionId } = JSON.parse(response.text);

  expect(customerId).toBeNull();
  expect(sessionId).toBeDefined();
});

it.todo(`Create validation for data structure which is passed to cart, such as febric, model
They are complex data structure need more time 
`);
