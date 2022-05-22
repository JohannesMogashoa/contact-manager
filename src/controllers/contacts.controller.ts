import { RequestHandler } from 'express'
import prisma from '../client'

export const getAllContacts: RequestHandler = async (req, res, next) => {
  try {
    const contacts = await prisma.contact.findMany({ where: { userId: req.params.userId } })
    res.status(200).json(contacts)
  } catch (error) {
    next(error)
  }
}

export const getContact: RequestHandler = async (req, res, next) => {
  try {
    const contact = await prisma.contact.findUnique({ where: { id: req.params.id }, include: { notes: true } })
    if (!contact || contact.isDeleted) res.status(404).json({ error: 'Invalid contact id' })

    res.status(200).json(contact)
  } catch (error) {
    next(error)
  }
}

export const createContact: RequestHandler = async (req, res, next) => {
  try {
    const { contactInfo } = req.body

    const contact = await prisma.contact.create({
      data: {
        ...contactInfo,
        userId: req.params.userId
      }
    })

    res.status(201).json(contact)
  } catch (error) {
    next(error)
  }
}

export const editContact: RequestHandler = async (req, res, next) => {
  try {
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: {
        ...req.body
      }
    })

    res.status(200).json(contact)
  } catch (error) {
    next(error)
  }
}

export const deleteContact: RequestHandler = async (req, res, next) => {
  try {
    await prisma.contact.update({ where: { id: req.params.id }, data: { isDeleted: true } })
    res.status(200).json({ msg: 'Deleted Successfully' })
  } catch (error) {
    next(error)
  }
}

export const deleteManyContacts: RequestHandler = async (req, res, next) => {
  try {
    const { ids } = req.body
    ids.forEach(async (id: string) => {
      await prisma.contact.delete({ where: { id } })
    })
    res.status(200).json({ msg: 'Deleted Successfully' })
  } catch (error) {
    next(error)
  }
}
