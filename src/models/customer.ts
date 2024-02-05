import mongoose from "mongoose";
import { Password } from "../utils/password";

export type IMeasurementUnite = "feet" | "cm" | null;
export enum IMeasurementUniteEnum {
  feet = "feet",
  cm = "cm",
}

export interface IMeasurementBase {
  height: number | null;
  inch: number | null;
  weight: number | null;
  age: number | null;
  unite: IMeasurementUnite;
}



export interface CustomerAttrs extends IMeasurementBase {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  verified: boolean;
}

export interface CustomerDoc extends IMeasurementBase, mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  firstName: string | null;
  lastName: string | null;
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
  build(attrs: CustomerAttrs): CustomerDoc;
}
const CustomerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    height: { type: Number, default: null },
    inch: { type: Number, default: null },
    weight: { type: Number, default: null },
    age: { type: Number, default: null },
    unite: {
      type: String,
      enums: Object.values(IMeasurementUniteEnum),
      default: IMeasurementUniteEnum.feet,
    },
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
CustomerSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

CustomerSchema.statics.build = (attrs: CustomerAttrs) => {
  return new Customer(attrs);
};
const Customer = mongoose.model<CustomerDoc, CustomerModel>(
  "Customer",
  CustomerSchema
);
export { Customer };
