import request from 'supertest';
import { app } from '../../../app';
import { cartData } from './data';

it('create the cart and fetchs the cart', async() => {
    const createCart = await request(app)
    .post('/api/cart')
    .set('Cookie', global.signinCustomer())
    .send(cartData)
    .expect(200);

    const { customerId, sessionId } = JSON.parse(createCart.text);

    console.log(customerId, sessionId)

    const carts = await request(app).get('/api/cart').expect(200);

    const parse = JSON.parse(carts.text);

    console.log(parse)
})