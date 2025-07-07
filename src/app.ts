
import express, { Application, Request, Response } from 'express'
import { booksRouters, borrowRouters } from './app/models/booksRouter'
import cors from 'cors'
const app: Application = express()

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','https://assignment4-delta-seven.vercel.app']
}))

app.use('/', booksRouters)
app.use('/', borrowRouters)

app.get('/', (req:Request, res:Response) => {
  res.send('Books library server is running')
})


export default app;
