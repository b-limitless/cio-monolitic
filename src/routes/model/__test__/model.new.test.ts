import request from 'supertest';
import { app } from '../../../app';

it('throw bad request if no email and password is provided ', async () => {
    await request(app)
      .post('/api/model')
      .send({
        
      })
      .expect(400);
  });