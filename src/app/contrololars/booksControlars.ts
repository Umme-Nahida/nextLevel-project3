

import mongoose, { Schema } from "mongoose";
import { bookInterface } from "../interfaces/booksInterface";

const booksSchema = new Schema<bookInterface>({
   title: {type: String, required: true},
   author: {type: String, required:true},
   genre: {type: String, required: true, enum: {values:['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], message:"{VALUE} is not valid "}},
   isbn: {type: String, required: true, unique: true},
   description: {type: String, required: false},
   copies: {type: Number, required: true, min: [0, "Copies must be a positive number"]},
   available: {type: Boolean, default: true}
}, 
{ versionKey: false, timestamps: true})

export const booksCollections = mongoose.model('booksCollections', booksSchema);

