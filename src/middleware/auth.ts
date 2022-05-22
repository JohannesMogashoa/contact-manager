import { NextFunction, Request, Response } from 'express'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.loggedInUser
    if (!user) {
      return res.status(401).json({
        error: 'You are not authorized'
      })
    }
    req.params.user = user
    next()
  } catch (error) {
    next(error)
  }
}
