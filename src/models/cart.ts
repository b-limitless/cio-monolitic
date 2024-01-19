import mongoose from "mongoose";
import { modelProperties } from "../__mock__/model";
import { ModelKeys, TModelRow } from "../types/model";
import { ECartStatus } from "../enum/cart";


export type IModelAction = Record<ModelKeys, TModelRow>;

export interface StyleAttrs {
  customerId: mongoose.Schema.Types.ObjectId;
  originalImageUrl: string;
  thumbnailImageUrl: string;
  status: ECartStatus;
  model: IModelAction;
  
}

interface StyleDoc extends mongoose.Document {}
interface StyleModel extends mongoose.Model<StyleDoc> {
  build(attrs: StyleAttrs): StyleDoc;
}
const StyleSchema = new mongoose.Schema(
  {},
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
