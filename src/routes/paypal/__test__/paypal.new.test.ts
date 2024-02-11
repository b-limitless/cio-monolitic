import request from 'supertest';
import { app } from '../../../app';


it('throw bad request error if no client id and secret is provided', async () => {
    await request(app).post('/api/paypal').send({}).expect(400);
});

it('creates paypal security and client key', async() => {

});