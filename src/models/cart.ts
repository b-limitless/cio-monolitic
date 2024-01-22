/**
 * When checkout is completed then orderId is assigned to each item and it could be
 * In incremental order
 * **/
import mongoose from "mongoose";
import { ECartStatus } from "../enum/cart";
import { TFebric } from "../types/febric";
import { TMode } from "../types/mode";
import { ModelKeys, TModelRow } from "../types/model";

export type IModelAction = Record<ModelKeys, TModelRow>;

export interface CartAttrs {
  customerId: mongoose.Schema.Types.ObjectId | null;
  originalImageUrl: string;
  thumbnailImageUrl: string;
  status: ECartStatus;
  model: IModelAction;
  febric: TFebric;
  modelType: TMode;
  subTotal: number;
  qty: number;
  discount?: number;
  availability: String;
  deliveryTime?: string | null;
  orderId: string | null;
  sessionId:string;
}

export interface CartDoc extends mongoose.Document {}

interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc;
}
const CartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    originalImageUrl: { type: String, required: true },
    thumbnailImageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ECartStatus),
      required: true,
      default: "open",
    },
    model: { type: Object, required: true }, // Assuming it's a subdocument, adjust as needed
    febric: { type: Object, required: true }, // Adjust based on the actual type of TFebric
    modelType: { type: String, required: true }, // Adjust based on the actual type of TMode
    subTotal: { type: Number, required: true },
    qty: { type: Number, required: true },
    discount: { type: Number },
    availability: { type: String },
    deliveryTime: { type: String },
    orderId: { type: String },
    sessionId: {type:String}
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

CartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs);
};
const Cart = mongoose.model<CartDoc, CartModel>("Cart", CartSchema);
export { Cart };
