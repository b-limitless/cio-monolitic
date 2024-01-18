import mongoose from "mongoose";

export interface ShippingAttrs {
  cusomerId: mongoose.Schema.Types.ObjectId;
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2?: string | null; // Optional
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  email: string | null;
}
interface ShippingDoc extends mongoose.Document {
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2?: string | null; // Optional
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  email: string | null;
}
interface ShippingModel extends mongoose.Model<ShippingDoc> {
  build(attrs: ShippingAttrs): ShippingDoc;
}
const ShippingSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    addressLine1: { type: String, default: null },
    addressLine2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    postalCode: { type: String, default: null },
    country: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    countryCode: { type: String, default: null },
    email: { type: String, default: null },
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

ShippingSchema.statics.build = (attrs: ShippingAttrs) => {
  return new Shipping(attrs);
};
const Shipping = mongoose.model<ShippingDoc, ShippingModel>(
  "Shipping",
  ShippingSchema
);
export { Shipping };
