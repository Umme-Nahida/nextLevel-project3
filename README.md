I have Developed a Library Management System using Express, TypeScript, and MongoDB (via Mongoose). 


My project is included below this features:

* Proper schema validation
*  logic enforcement (e.g., availability control on borrow)
* Use of aggregation pipeline
* At least one Mongoose static or instance method
* Use of Mongoose middleware (pre, post)
* Filtering features


<h4>API Endpoints:</h4>

1. POST /api/borrow and /api/books
2. GET /api/borrow and /api/books
3. this api used for filter and sort books: ( GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5 )
4. get single book by id using this api: (GET /api/books/:bookId )
5. update a single book by id using this api: ( PUT /api/books/:bookId )

