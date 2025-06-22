
import express, { Application, Request, Response } from 'express'
import { booksRouters, borrowRouters } from './app/models/booksRouter'
const app: Application = express()

app.use(express.json());

app.use('/', booksRouters)
app.use('/', borrowRouters)

app.get('/', (req:Request, res:Response) => {
  res.send('Books library server is running')
})


export default app;
