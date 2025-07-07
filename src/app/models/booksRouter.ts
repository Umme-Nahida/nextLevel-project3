import express, { Request, Response } from 'express';
import { borrowCollection } from '../contrololars/borrowControlar';
import { booksCollections } from '../contrololars/booksControlars';


export const booksRouters = express.Router();
export const borrowRouters = express.Router();


// create a new book
booksRouters.post('/api/books', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const books = new booksCollections(body);

        await books.save();

        res.json({
            success: true,
            message: "Book created successfully",
            data: books
        })


    } catch (error: any) {

        let errorName = 'Error';

        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: error?.errors?.title?.message || error?.errors?.errorResponse?.message || 'something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };

        res.json(errorResponse)

    }

})

// get all books
booksRouters.get('/api/books', async (req: Request, res: Response) => {
  try {
    console.log("Query params:", req.query);
   

    const { filter, sortBy, sort, limit, page } = req.query;

    const currentPage = Number(page) || 1;
    const pageLimit = Number(limit) || 5;
    const skip = (currentPage - 1) * pageLimit;

    let query: any = {};
    if (filter) {
      query.genre = filter;
    }

    console.log('currentPage',currentPage)
    console.log('limit',pageLimit)
    console.log('skip',skip)
    console.log('query',query)
    let books = [];

    if (filter || sortBy || sort || currentPage || pageLimit) {
      books = await booksCollections
        .find(query)
        .sort(sortBy ? { [sortBy as string]: sort === 'desc' ? -1 : 1 } : {})
        .skip(skip)
        .limit(pageLimit)
    } else {
      books = await booksCollections.find()
    }

    const total = await booksCollections.countDocuments(query);

    res.json({
      success: true,
      message: 'Books retrieved successfully',
      data: books,
      meta: {
        total,
        page: currentPage,
        limit: pageLimit,
      },
    });
  } catch (error) {
    let errorName = 'Error';
    if (error && typeof error === 'object' && 'name' in error) {
      errorName = (error as { name: string }).name;
    }

    res.status(500).json({
      message: 'Something went wrong',
      success: false,
      error: {
        name: errorName,
        errors: error,
      },
    });
  }
});



// get signle book by id
booksRouters.get('/api/books/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;

        const book = await booksCollections.findById(id);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        })

    } catch (error) {

        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };

        res.json(errorResponse)
    }


})


// updated single book
booksRouters.put('/api/books/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;
        const body = req.body;
        //   console.log(body)
        const book = await booksCollections.findByIdAndUpdate(id, body, { new: true })
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book
        })

    } catch (error) {

        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };
        res.json(errorResponse)
    }

})


// delete single book
booksRouters.delete('/api/books/:bookId', async (req: Request, res: Response) => {
    try {
        const id = req.params.bookId;

        const book = await booksCollections.findByIdAndDelete(id)
        res.status(201).json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error) {

        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };
        res.json(errorResponse)
    }
})


borrowRouters.post('/api/borrow', async (req: Request, res: Response) => {
    try {
        const { book, quantity, dueDate } = req.body;

        const singleBook = await booksCollections.findById(book);

        if (!singleBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (singleBook.copies < quantity) {
            return res.status(400).json({ message: "Not enough copies available to borrow" });
        }

        singleBook.copies -= quantity;

        if (singleBook.copies === 0 && singleBook.available !== false) {
            singleBook.available = false;
            await singleBook.save()
        }

        await singleBook.save();


        const borrowBook = await borrowCollection.create({ book, quantity, dueDate });


        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowBook
        });
    } catch (error) {

        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };
        res.json(errorResponse)
    }
});


borrowRouters.get('/api/borrow', async (req: Request, res: Response) => {
    try {
        const result = await borrowCollection.aggregate([
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

        ])
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: result
        });


    } catch (error) {

        let errorName = 'Error';
        if (error && typeof error === 'object' && 'name' in error) {
            errorName = (error as { name: string }).name;
        }

        const errorResponse = {
            message: 'Something went wrong',
            success: false,
            error: {
                name: errorName,
                errors: error

            }
        };
        res.json(errorResponse)
    }
})



