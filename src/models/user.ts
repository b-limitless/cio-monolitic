import mongoose from "mongoose";
import { Password } from "../utils/password";
import { Schema } from "mongoose";
export interface UserAttrs {
  email: string;
  password: string;
  role:string;
  permissions: string[];
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  spokenLanguage: string[];
  about: string | null;
  profileImageLink: string | null; 
  adminId?: mongoose.Types.ObjectId | null
}
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  role:string;
  permissions: string[];
  verified:boolean;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  spokenLanguage: string[];
  about: string | null;
  profileImageLink: string | null;
  adminId?: mongoose.Types.ObjectId | null;
  originalImageUrl?:string;
  thumbnailImageUrl?:string;
}
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    permissions: [{
      type: Schema.Types.ObjectId,
      ref: "Permission", // Reference to the Permission model
    }],
    verified: {
      type: Boolean, 
      default: false
    }, 
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    spokenLanguage: {
      type: [String],
      default: [],
    },
    about: {
      type: String,
      default: null,
    },
    profileImageLink: {
      type: String,
      default: null,
    },
    adminId: {
      type: mongoose.Types.ObjectId || null, 
      required: false
    },
    originalImageUrl: {
      type: String,
      default: null,
    },
    thumbnailImageUrl: {
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
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
