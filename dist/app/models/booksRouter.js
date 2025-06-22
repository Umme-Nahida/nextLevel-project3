"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRouters = exports.booksRouters = void 0;
const express_1 = __importDefault(require("express"));
const borrowControlar_1 = require("../contrololars/borrowControlar");
const booksControlars_1 = require("../contrololars/booksControlars");
exports.booksRouters = express_1.default.Router();
exports.borrowRouters = express_1.default.Router();
// create a new book
exports.booksRouters.post('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const books = new booksControlars_1.booksCollections(body);
        yield books.save();
        res.json({
            success: true,
            message: "Book created successfully",
            data: books
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
// get all books
exports.booksRouters.get('/api/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit } = req.query;
        let books = [];
        if (filter || sortBy || sort || limit) {
            books = yield booksControlars_1.booksCollections.find({ genre: filter }).sort({ [sortBy]: sort === 'desc' ? -1 : 1 }).limit(Number(limit));
        }
        else {
            books = yield booksControlars_1.booksCollections.find();
        }
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
// get signle book by id
exports.booksRouters.get('/api/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield booksControlars_1.booksCollections.findById(id);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
// updated single book
exports.booksRouters.put('/api/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const body = req.body;
        //   console.log(body)
        const book = yield booksControlars_1.booksCollections.findByIdAndUpdate(id, body, { new: true });
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
// delete single book
exports.booksRouters.delete('/api/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const book = yield booksControlars_1.booksCollections.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
exports.borrowRouters.post('/api/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        const singleBook = yield booksControlars_1.booksCollections.findById(book);
        if (!singleBook) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (singleBook.copies < quantity) {
            return res.status(400).json({ message: "Not enough copies available to borrow" });
        }
        singleBook.copies -= quantity;
        if (singleBook.copies === 0 && singleBook.available != false) {
            singleBook.available = false;
            yield singleBook.save();
        }
        yield singleBook.save();
        const borrowBook = yield borrowControlar_1.borrowCollection.create({ book, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowBook
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
exports.borrowRouters.get('/api/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrowControlar_1.borrowCollection.aggregate([
            {
                $group: { _id: "$book", totalQuantity: { $sum: "$quantity" } }
            },
            {
                $lookup: {
                    from: "bookscollections",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo"
                }
            },
            { $unwind: '$bookInfo' },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn"
                    },
                    totalQuantity: "$totalQuantity"
                }
            }
        ]);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: result
        });
    }
    catch (error) {
        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = error.name;
        }
        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error
            }
        };
        res.json(errorResponse);
    }
}));
