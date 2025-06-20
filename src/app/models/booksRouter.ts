import express, { Request, Response } from 'express';
import app from '../../app';
import { booksCollection } from '../contrololars/booksControlars';

export const booksRouters = express.Router();

booksRouters.get('/', (req: Request, res: Response) => {
    res.send('this is the books route')
})

booksRouters.post('/api/books', async (req: Request, res: Response) => {
    const body = req.body;
    const books = new booksCollection(body);

    await books.save();
    res.json({
        success: true,
        message: "Book created successfully",
        data: books
    })
})

booksRouters.get('/api/books', async (req: Request, res: Response) => {
    const {filter, sortBy,sort,limit} = req.query;
   
   
    const books = await booksCollection.find({genre: filter}).sort({[sortBy as string]: sort === 'desc' ? -1 : 1}).limit(Number(limit));
    res.json({
        success: true,
        message: "Books retrieved successfully",
        data: books
    })
})

booksRouters.get('/api/books/:bookId', async (req: Request, res: Response) => {
    const id = req.params.bookId;
   
    const book = await booksCollection.findById(id);
    res.json({
        success: true,
        message: "Book retrieved successfully",
        data: book
    })
})