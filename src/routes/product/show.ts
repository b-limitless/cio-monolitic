import { NotFoundError } from "@pasal/common";
import express, { Request, Response } from "express";
import { Febric } from "../../models/febric";

const router = express.Router();

router.get("/api/products/v1/:id", async (req: Request, res: Response) => {
  const products = await Febric.findById(req.params.id);

  if (!products) {
    throw new NotFoundError("Proudct not found");
  }

  res.send(products);
});

export { router as showProductRouter };
