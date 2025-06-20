
import express, { Application, Request, Response } from 'express'
import { booksRouters } from './app/models/booksRouter'
const app: Application = express()

app.use(express.json());

app.use('/', booksRouters)

app.get('/', (req:Request, res:Response) => {
  res.send('Books library server is running')
})


export default app;
