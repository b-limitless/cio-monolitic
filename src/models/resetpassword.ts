import mongoose from "mongoose";

enum updated {
    true,
    false
}

interface ResetPasswordAttrs {
    user_id:string;
    code: string;
}

interface ResetPasswordDoc extends mongoose.Document {
    user_id:string;
    code: string;
    created_at: Date;
    expire_at: Date;
    updated: updated
}

interface ResetPasswordModel extends mongoose.Model<ResetPasswordDoc> {
   build(attrs: ResetPasswordAttrs) : ResetPasswordDoc
}

const resetPasswordSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required:true
    },
    code: {
        type: String,
        required:true
    },
    created_at: {
        type: Date,
        default:() => new Date()
    },
    expire_at: {
        type:Date,
        default:() => new Date(+new Date() + 8 * 60 * 60 * 1000),
        required:true
    },
    updated: {
        type: Boolean,
        enum: [true, false],
        default: () => false
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete(ret._id);
            delete(ret.__v);
        }
    }
});

resetPasswordSchema.statics.build = (attrs: ResetPasswordAttrs) => {
    return new ResetPassword(attrs);
}

const ResetPassword = mongoose.model<ResetPasswordDoc, ResetPasswordModel>('ResetPassword', resetPasswordSchema);

export {ResetPassword}