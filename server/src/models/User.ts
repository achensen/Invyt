import { Schema, model, type Document } from 'mongoose';


interface IUser extends Document {
    email: string,
    events: Schema.Types.ObjectId[]
    password: string,
}


const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match an email address!'],

    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }],

    password: {
        type: String,
        required: true,
    }
},
    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);


const User = model('User', userSchema);

export default User;