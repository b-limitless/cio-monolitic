import express from 'express';
import {currentUser, requireAuth} from '@pasal/common';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user';
import logger from '../logger';


const router = express.Router();


router.get('/api/users/currentuser',  requireAuth, currentUser, (req, res) => {
  //!req.session || !req.session.jwt is equal to
  res.send({currentUser: req.currentUser || null});
});



export { router as currentUserRouter };
