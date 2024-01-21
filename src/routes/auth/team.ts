import {
  BadRequestError,
  currentUser,
  hasPermissions,
  requireAuth,
  validateRequest,
} from '@pasal/common';
import logger from '@pasal/common/build/logger';
import express, { Request, Response } from 'express';
import { TeamBodyRequest } from '../../body-request/Team.body-request';
import { mailerEmail } from '../../config/email';
import { sendMail } from '../../mailar';
import { messages } from '../../messages';
import { UserService } from '../../services/User.service';
import { readFile } from '../../utils/readFile';
import { checkPermissionAllSet } from '../utils';
import { User } from '../../models/user';
import { limit } from '../../config/email';
import { Permission } from '../../models/permissions';
import mongoose from 'mongoose';
import { mockUsers } from '../../__mock__/user';

// Rememer you are updating full resource therefore use PUT method rather then PATCH
// PATCH is used when there is partial modification of resource
// Update api and test and front end files 



type filterQuery = { [x: string]: string[] };

interface BaseFilter {
  page: string;
}

interface filterInput extends BaseFilter {
  filters: string | object;
}

interface filtersReturn {
  filterQuery: filterQuery;
  pageNumber: number;
}

export const getFilterQueryNPage = ({
  page,
  filters,
}: filterInput): filtersReturn => {
  let pageNumber = Number(page) ?? 0;

  if (pageNumber > 0) {
    pageNumber = pageNumber - 1;
  }

  try {
    filters = JSON.parse(filters as string);
  } catch (err) {
    filters = {};
  }

  let filterQuery: any = {};

  Object.keys(filters).map((key) => {
    if (filters[key].length > 0) {
      filterQuery[key] = { $in: filters[key] };
    }
  });

  return { pageNumber, filterQuery };
};
//

const router = express.Router();

router.post(
  '/api/users/team/v1',
  TeamBodyRequest,
  validateRequest,
  requireAuth,
  // hasPermissions(['create_team']),
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, permissions, role } =
      req.body;
    // verified
    const existingUser = await UserService.findOne(email);

    const { id: adminId } = req.currentUser || {};

    if (existingUser) {
      throw new BadRequestError(messages.emailExists);
    }

    const permissionObject = permissions.map((permission:string) => new mongoose.Types.ObjectId(permission));

    // Checking if permission is exists in collection
    const isAllPermissionExits = await Permission.find({_id: {$in: permissionObject}});
    
    if(isAllPermissionExits.length !== permissions.length) {
      throw new BadRequestError('All provided permissions was unable to find');
    }

    const user = await UserService.build({
      firstName,
      lastName,
      email,
      password,
      permissions,
      role,
      verified: true,
      adminId,
    });

    const mapIds = permissions.map((permission) => new mongoose.Types.ObjectId(permission));
    // const findPermissions = await Permission.find({_id: {$in: mapIds}});
    

    res.status(201).send(user);

    try {
      const getWelcomeEmailTempalte = await readFile('welcome-team.html', {
        firstName,
        email,
        password,
      });

      const sendWelcomeEmail = await sendMail({
        from: mailerEmail,
        to: email,
        subject: 'Welcome to Customize.io - Your Account Has Been Created!',
        text: '',
        html: getWelcomeEmailTempalte,
      });
      logger.log('info', messages.wcSent, sendWelcomeEmail);
    } catch (err) {
      logger.log('error', `${messages.wcCanNotSent} ${err}`);
    }
  }
);

router.get('/api/users/team/v1', requireAuth, async (req: Request, res: Response) => {
  const page = (req.query.page ?? 0) as string;

  const filters = req.query.filters as string;

  const { pageNumber, filterQuery } = getFilterQueryNPage({ page, filters });
  const adminId = req.currentUser?.id;
  const affectedRows = await User.countDocuments({...filterQuery, adminId});

  const users = await User.find({...filterQuery, adminId}, {})
    .skip(Number(pageNumber) * limit)
    .limit(limit)
    

  res.send({ users, affectedRows });
});


router.post(
  '/api/users/team/check-email',
  requireAuth,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const existingUser = await UserService.findOne(email);

    if (existingUser) {
      throw new BadRequestError(messages.emailExists, 'email');
    }

    return res.status(200).send(null);
  }
);

router.get('/api/users/team/mock', async (req: Request, res: Response) => {
  try {
    await User.insertMany(mockUsers);
    res.send('Team successfully added');
  } catch (err) {
    res.send(`Could not insert team ${err}`);
    throw new Error(`Could not insert team ${err}`);
  }
});

router.get('/api/users/v1/:id', requireAuth, async(req: Request, res:Response) => {
  let id:string|mongoose.Types.ObjectId = '';

   const userId = req.params.id;
   id = new mongoose.Types.ObjectId(userId);
   
   

  try {
    const user = await User.findOne({_id: id}).populate('permissions');
    res.send(user);
  } catch (err:any) {
    logger.log('error', `Can not find user ${err}`);
    throw new Error(err);
  }
})

router.delete('/api/users/team/v1/:id', async(req: Request, res:Response) => {
  const {id} = req.params;

  if(!id) {
    throw new BadRequestError('Please provide user id to delete');
  }

  try {
    await UserService.deleteOne(id);
    res.send('User deleted successfully');
  } catch(err) {
    logger.log('error', `Could not delete error ${err}`);
    throw new Error(`Could not delete error ${err}`);
  }
});

// APis only for the testing
router.get('/api/users/v1/all', async(req:Request, res:Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch(err:any) {
    throw new Error(err);
  }
})

export { router as teamRouter };
