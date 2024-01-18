import mongoose from "mongoose";
import { ProductType } from "./types";

export interface ModelAttrs {
  type: ProductType;
  name: string;
  title: string;
  model: string;
  price: number;
}
interface ModelDoc extends mongoose.Document {
  type: ProductType;
  name: string;
  title: string;
  model: string;
  price: number;
}
interface ModelModel extends mongoose.Model<ModelDoc> {
  build(attrs: ModelAttrs): ModelDoc;
}
const ModelSchema = new mongoose.Schema(
  {
    type: { type: String, enum: Object.values(ProductType)},
    name: { type: String, required: true },
    title: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
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

ModelSchema.statics.build = (attrs: ModelAttrs) => {
  return new Model(attrs);
};
const Model = mongoose.model<ModelDoc, ModelModel>("Model", ModelSchema);
export { Model };
