import { currentCustomer, requireCustomerAuth } from '@pasal/common';
import express from 'express';


const router = express.Router();


router.get('/api/customer/currentCustomer',  requireCustomerAuth, currentCustomer, (req, res) => {
  //!req.session || !req.session.jwt is equal to
  res.send({currentCustomer: req.currentCustomer || null});
});



export { router as currentCustomerRouter };
