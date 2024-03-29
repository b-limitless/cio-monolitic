/**
 * As we are string accent inside the cart then type that we are strong must be same 
 * as the model accent but for now different, right at the moment we are not working on accent
 * thefore this should mark as note when we start to work on accen  update its model
 * {
 * 
 * id: number | string;
  meshName: string[];
  febric: string;
  updatedFrom: TModelNavigation;
  price: number;
  code?: string
  label?:string;
  season?:string;
  type: TCollarAccent;}

  for more detail check the accent type inside the cart model
 * 
 * 
 * 
 * **/
import mongoose from "mongoose";
import { ProductPartNames, ProductType } from "./types";

export interface AccentAttrs {
  type: ProductType;
  partName: ProductPartNames;
  price: number;
  febric: string;
  meshName: string[];
}
export interface AccentDoc extends mongoose.Document {
  type: ProductType;
  partName: ProductPartNames;
  price: number;
  febric: string;
  meshName: string[];
}
interface AccentModel extends mongoose.Model<AccentDoc> {
  build(attrs: AccentAttrs): AccentDoc;
}
const AccentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(ProductType) },
    partName: { type: String, enum: Object.values(ProductPartNames) },
    price: { type: Number, required: true },
    febric: { type: String, required: true },
    meshName: { type: [String], required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

AccentSchema.statics.build = (attrs: AccentAttrs) => {
  return new Accent(attrs);
};
const Accent = mongoose.model<AccentDoc, AccentModel>("Accent", AccentSchema);
export { Accent };
