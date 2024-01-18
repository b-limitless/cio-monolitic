import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('throw 400 bad request while no request valid mongo id is supplied', async() => {
    // await request(app).get(`/api/products/v1/asdfasdfsdf`).expect(400);
});

// it('it will throw 404 not found error, if valid id supplied but product is not found ', async() => {
//     const id = new mongoose.Types.ObjectId().toHexString();
//     await request(app).get(`/api/products/v1/${id}`).expect(404);
// });

// it('create product and find the product by id ', async() => {
//     const response = await request(app)
//     .post("/api/products/v1/new")
//     .set("Cookie", global.signin([]))
//     .send({
//       name: "coat",
//       category: "cloth",
//       subCategory: "cloth",
//       price: 100,
//       availableItems: 100,
//     })
//     .expect(201);

//     await request(app).get(`/api/products/v1/${response.body.id}`).expect(200);
   
// });
