import { RequestHandler } from 'express'
import { compare, hash } from 'bcrypt'
import prisma from '../client'
import jwt from 'jsonwebtoken'

const encrpytPassword: (password: string) => Promise<string> = async (password: string) => {
  return await hash(password, 25)
}

const decryptPassword: (password: string, hashedPassword: string) => Promise<boolean> = async (password: string, hashedPassword: string) => {
  return await compare(password, hashedPassword)
}

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hashedPassword = await encrpytPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    const savedUser = await prisma.user.update({ select: { id: true }, where: { id: user.id }, data: { token } })

    res.status(201).json({
      data: savedUser,
      token
    })
  } catch (error) {
    next(error)
  }
}

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const dbUser = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!dbUser) res.status(304).json({ error: 'Invalid Credentials' })

    if (!await decryptPassword(password, dbUser.password)) res.status(304).json({ error: 'Invalid Credentials' })

    const token = jwt.sign({ userId: dbUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    const user = await prisma.user.update({ select: { id: true }, where: { id: dbUser.id }, data: { token } })

    res.status(200).json({
      data: user,
      token
    })
  } catch (error) {
    next(error)
  }
}
