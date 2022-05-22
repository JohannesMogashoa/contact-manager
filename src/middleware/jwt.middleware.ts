import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../client'

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-auth-token']) {
    const token = req.headers['x-auth-token']
    const { username, exp }: any = jwt.verify(token as string, process.env.JWT_SECRET as string)

    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        errors: [
          {
            name: 'Unauthenticated',
            message: 'JWT token has expired, please login to get a new one'
          }
        ]
      })
    }

    res.locals.loggedInUser = await prisma.user.findUnique({ where: { username } })

    next()
  } else {
    res.status(400).json({
      error: 'You do not have a valid token. Please login to get one.'
    })
  }
}
