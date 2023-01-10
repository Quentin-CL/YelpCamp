import mongoose from 'mongoose';
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
export default mongoose.model("User", UserSchema);