

// Book Model Fields & Validation
// title (string) — Mandatory. The book’s title.
// author (string) — Mandatory. The book’s author.
// genre (string) — Mandatory. Must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY.
// isbn (string) — Mandatory and unique. The book’s International Standard Book Number.
// description (string) — Optional. A brief summary or description of the book.
// copies (number) — Mandatory. Non-negative integer representing total copies available.
//  available (boolean) — Defaults to true. Indicates if the book is currently available for borrowing.

import mongoose, { Schema } from "mongoose";
import { bookInterface } from "../interfaces/booksInterface";

const booksSchema = new Schema<bookInterface>({
   title: {type: String, required: true},
   author: {type: String, required:true},
   genre: {type: String, required: true, enum: {values:['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], message:"{VALUE} is not valid "}},
   isbn: {type: String, required: true, unique: true},
   description: {type: String, required: false},
   copies: {type: Number, required: true, min: 0},
   available: {type: Boolean, default: true}
}, 
{ versionKey: false, timestamps: true})

export const booksCollections = mongoose.model('booksCollections', booksSchema);

