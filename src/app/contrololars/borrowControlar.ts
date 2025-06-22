import mongoose, { Schema, Types } from "mongoose";
import { IBorrow } from "../interfaces/borrowInterface";

const borrowSchema = new Schema<IBorrow>({
    book: {type: mongoose.Schema.Types.ObjectId, ref:'book', required: true},
    quantity: {type: Number, required: true, min: 1},
    dueDate: {type: Date, required: true}
},{timestamps: true, versionKey: false});

export const borrowCollection = mongoose.model('borrowCollection', borrowSchema);