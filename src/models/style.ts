import mongoose from "mongoose";
import { ProductPartNames, ProductType } from "./types";

export interface StyleAttrs {
  type: ProductType;
  partName: ProductPartNames;
  price: number;
  title: string;
  code: string;
  label: string;
  model: string;
}
export interface StyleDoc extends mongoose.Document {
  type: ProductType;
  partName: ProductPartNames;
  price: number;
  title: string;
  code: string;
  label: string;
  model: string;
}
interface StyleModel extends mongoose.Model<StyleDoc> {
  build(attrs: StyleAttrs): StyleDoc;
}
const StyleSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(ProductType) },
    partName: { type: String, enum: Object.values(ProductPartNames) },
    price: { type: Number, required: true },
    title: { type: String, required: true },
    code: { type: String, required: true },
    label: { type: String, required: true },
    model: { type: String, required: true },
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

StyleSchema.statics.build = (attrs: StyleAttrs) => {
  return new Style(attrs);
};
const Style = mongoose.model<StyleDoc, StyleModel>("Style", StyleSchema);
export { Style };
