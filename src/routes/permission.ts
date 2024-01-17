import express, { Request, response, Response } from "express";
import { body } from "express-validator";
import { Permission } from "../models/permissions";
import { validateRequest, BadRequestError, requireAuth } from "@pasal/common";

const router = express.Router();

router.get(
  "/api/users/get-authorizations",
  // requireAuth,
  async (req: Request, res: Response) => {
    res.send("fuck you")
    // try {
    //   const permissions = await Permission.aggregate([
    //     {
    //       $group: {
    //         _id: "$role",
    //         permissions: {
    //           $push: {
    //             id: "$_id",
    //             name: "$name",
    //             cat: "$cat",
    //             guard_name: "$guard_name",
    //             created_at: "$created_at",
    //           }
    //         }
    //       }
    //     },
    //     {
    //       $project: {
    //         role: "$_id",
    //         permissions: 1,
    //         _id: 0
    //       }
    //     }
    //   ])
    //   // const permissions = await Permission.find();
    //   res.send(permissions);
    // } catch(err) {
    //   throw new Error(`Could not fetch permissions`)
    // }
  }
);


router.get(
  "/api/users/authorizations",
  // requireAuth,
  async (req: Request, res: Response) => {
    
    try {
      const permissions = await Permission.aggregate([
        {
          $group: {
            _id: "$role",
            permissions: {
              $push: {
                id: "$_id",
                name: "$name",
                cat: "$cat",
                guard_name: "$guard_name",
                created_at: "$created_at",
              }
            }
          }
        },
        {
          $project: {
            role: "$_id",
            permissions: 1,
            _id: 0
          }
        }
      ])
      // const permissions = await Permission.find();
      res.send(permissions);
    } catch(err) {
      throw new Error(`Could not fetch permissions`)
    }
  }
);
router.post(
  "/api/users/permission/create",
  [
    body("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission name is required"),
    body("cat")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission category is required"),
    body("guard_name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission guard name is required"),
    body("role")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission role is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, cat, guard_name, role } = req.body;

    const existingPermission = await Permission.findOne({ name, cat });

    if (existingPermission) {
      throw new BadRequestError(
        `Permission ${name} already exists with category ${cat}`
      );
    }

    const permission = Permission.build({
      name,
      cat,
      guard_name,
      role,
    });
    await permission.save();

    res.status(200).json({ permission });
  }
);


router.get(
  "/api/users/authorizations/mock",
  async (req: Request, res: Response) => {
    try {
      const permissions = [
        {
          name: "all",
          cat: "all",
          guard_name: "all",
          role: "all",
        },
        {
          name: "customerCare",
          cat: "customerCare",
          guard_name: "customerCare",
          role: "Customer Care",
        },
        {
          name: "acceptCall",
          cat: "customerCare",
          guard_name: "acceptCall",
          role: "Customer Care",
        },
        {
          name: "makeCall",
          cat: "customerCare",
          guard_name: "makeCall",
          role: "Customer Care",
        },
        {
          name: "createUser",
          cat: "createUser",
          guard_name: "createUser",
          role: "Administrator",
        },
        {
          name: "deleteUser",
          cat: "deleteUser",
          guard_name: "deleteUser",
          role: "Administrator",
        },
      ];

      await Permission.insertMany(permissions);
      res.send("Permission has been successfully added.");
    } catch (err) {
      res.send(`Could not insert mock data ${err}`);
    }
  }
);

export { router as permissionRouter };
