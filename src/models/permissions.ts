import mongoose from "mongoose";


interface PermissionAttrs {
    name: string;
    cat: string;
    guard_name: string;
    role: string;
}


interface PermissionDoc extends mongoose.Document {
    name: string;
    cat: string;
    guard_name: string;
    role: string;
}

interface PermissionModel extends mongoose.Model<PermissionDoc> {
    build(attrs: PermissionAttrs) : PermissionDoc;
}

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cat: {
        type: String,
        required:true
    },
    guard_name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: () => new Date()
    },
    role: {
        type: String,
        required: true
    },
    users_id: {
        type: Array
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

permissionSchema.statics.build = (attrs: PermissionAttrs) => {
    return new Permission(attrs)
}

const Permission = mongoose.model<PermissionDoc, PermissionModel>("Permission", permissionSchema);
export {Permission};