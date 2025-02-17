import { Schema, model, type Document } from 'mongoose';


interface IEvent extends Document {
    title:string,
    time: string,
    location: string,
    details: string,
}


const eventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    time: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
},
    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);


const Event = model('Event', eventSchema);

export default Event;