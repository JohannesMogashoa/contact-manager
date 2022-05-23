import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { authRoutes, contactsRoutes, notesRoutes } from './routes'
import morgan from 'morgan'
import jwtValid from './middleware/jwt.middleware'
import cors from 'cors'
require('dotenv').config()

interface Error {
  message: string;
  status: number;
  name: string
}

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(morgan('combined'))
app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)

app.use(jwtValid)

app.use('/api/contacts', contactsRoutes)
app.use('/api/notes', notesRoutes)

app.use((req: Request, res: Response, next: NextFunction) => {
  const err: Error = {
    name: 'Not Found',
    message: 'Not Found',
    status: 404
  }
  next(err)
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  })
}

app.use(errorHandler)

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`)
})
