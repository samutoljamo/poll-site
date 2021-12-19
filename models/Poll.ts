import {Schema, model} from "mongoose";
export interface Poll{
    name: string,
    options:[{
        name: string,
        votes: number,
        optid: number
    }],
    createdAt: Date
}
const PollSchema = new Schema<Poll>({
    name: String,
    options: [{
        name: String,
        votes: Number,
        optid: Number
    }]
}, {
    timestamps: true
});

export const PollModel = model<Poll>("Poll", PollSchema);

