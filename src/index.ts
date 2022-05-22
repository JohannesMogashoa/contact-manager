import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from './client'
import { login, register } from './controllers/auth_controller'
import routes from './routes'
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const accessToken = req.headers.authorization.split(' ')[1]
    const { userId, exp }: any = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    )

    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: 'JWT token has expired, please login to obtain a new one'
      })
    }
    res.locals.loggedInUser = await prisma.user.findFirst({ where: { id: userId } })
    next()
  } else {
    next()
  }
})

app.post('/api/register', register)
app.post('/api/login', login)

app.use('/api/contacts', routes)

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`)
})
