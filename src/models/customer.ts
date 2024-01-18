import mongoose from "mongoose";
import { Password } from "../utils/password";
export interface CustomerAttrs {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  verified: boolean;
}
interface CustomerDoc extends mongoose.Document {
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
