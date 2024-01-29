import { currentUser, requireAuth } from '@pasal/common';
import express from 'express';
import jwt from 'jsonwebtoken';


const router = express.Router();


router.get('/api/users/currentuser',  requireAuth, currentUser, (req, res) => {
  //!req.session || !req.session.jwt is equal to
  res.send({currentUser: req.currentUser || null});
});

// router.get('/api/users/test', (req, res) => {

//   const userJWT = jwt.sign(
//     {
//       id: existingUser.id,
//       email: existingUser.email,
//     },
//     process.env.JWT_KEY!
//   );

  
//     if(req.session) {
//       req.session.test = 'Hello world';
//     }
//     res.send('Cookie is set')
// })

router.post("/api/users/test", (req, res) => {
  const userJWT = jwt.sign(
    {
      id: "65aa90cc181f5b0656d73e44",
      email: "bharatrose1@gmail.com",
    },
    process.env.JWT_KEY!
  );

  if (req.session) {
    req.session.customerJwt = userJWT;
  }

 
  res.send(userJWT);
  //res.send();
});


export { router as currentUserRouter };
