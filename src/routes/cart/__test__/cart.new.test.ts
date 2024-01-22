import request from 'supertest';
import { app } from '../../../app';

it('create a cart with the data', async() => {
    await request(app)
    .post('/api/cart')
    .send({
      
    })
    .expect(400);
});

it.todo(`Create validation for data structure which is passed to cart, such as febric, model
They are complex data structure need more time 
`)