import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt, { sign } from 'jsonwebtoken';

declare global {
    var signin: (permission:string[]) => string[] 
    var signinCustomer: () => string[] 
}
let mongo: any;

declare global {
    namespace NodeJS {
        interface Global {
            signin(): Promise <string[]>;
        }
    }
}

beforeAll(async() => {
    process.env.NODE_ENV = "test";
    process.env.JWT_KEY = 'asdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async() => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async() => {
     mongo.stop();
     mongoose.connection.close();
});


// globle signing for the user B2B
global.signin = (permissions:string[]) => {
    // Build a JWT payload.  { id, email }
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
      permissions: permissions,
      role: 'admin',
    };
  
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
  
    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };
  
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
  
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
  
    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
  };

// Signin for the customer 
global.signinCustomer = () => {
    // Build a JWT payload.  { id, email }
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
    };
  
    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);
  
    // Build session Object. { jwt: MY_JWT }
    const session = { customerJwt: token };
  
    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);
  
    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');
  
    // return a string thats the cookie with the encoded data
    return [`express:sess=${base64}`];
  };

