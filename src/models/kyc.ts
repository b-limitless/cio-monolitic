import mongoose from "mongoose";


// Creating interface
interface KYCAttrs {
  industry: string[];
  employeCount:number;
  targetMarket: string[];
  currentWorkFlow: string | null;
  currentSoftware: string | null;
  painPoint: string | null;
  requirements: string | null;
  tranningAndSupport: string | null;
}

// An interface descript the properties that a KYC document pass
interface KYCDoc extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId,
  industry: string[];
  employeCount:number;
  targetMarket?: string[];
  currentWorkFlow?: string | null;
  currentSoftware?: string | null;
  painPoint?: string | null;
  requirements?: string | null;
  tranningAndSupport?: string | null;
}

// An interface define build function is available to the model
interface KYCModel extends mongoose.Model<KYCDoc> {
  build(attrs: KYCAttrs): KYCDoc;
}

// Create schema
const KYCSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    industry: {
      type: [String],
      default: [],
    },
    employeeCount: {
      type: Number,
      required: true,
    },
    targetMarket: {
      type: [String],
      default: [],
    },
    currentWorkFlow: {
      type: String,
      default: null,
    },
    currentSoftware: {
      type: String,
      default: null,
    },
    painPoint: {
      type: String,
      default: null,
    },
    requirements: {
      type: String,
      default: null,
    },
    trainingAndSupport: {
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

// Build
KYCSchema.statics.build = (attrs: KYCAttrs) => {
  return new KYC(attrs);
};

// Create mongoose model
const KYC = mongoose.model<KYCDoc, KYCModel>("KYC", KYCSchema);
export { KYC };
