import mongoose from "mongoose";

// Creating interface
export interface PaypalAttrs {
  userId: mongoose.Schema.Types.ObjectId;
  clientId: string;
  clientSecret: string;
}

// An interface descript the properties that a Paypal document pass
interface PaypalDoc extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  clientId: string;
  clientSecret: string;
}

// An interface define build function is available to the model
interface PaypalModel extends mongoose.Model<PaypalDoc> {
  build(attrs: PaypalAttrs): PaypalDoc;
}

// Create schema
const PaypalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clientId: {
      type: String,
      default: null,
      required: true,
    },
    clientSecret: {
      type: String,
      default: null,
      required: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    },
    updatedAt: {
        type: Date,
        default: () => new Date()
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

// Build
PaypalSchema.statics.build = (attrs: PaypalAttrs) => {
  return new Paypal(attrs);
};

// Create mongoose model
const Paypal = mongoose.model<PaypalDoc, PaypalModel>("Paypal", PaypalSchema);
export { Paypal };
