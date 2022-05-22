import { RequestHandler } from 'express'
import prisma from '../client'

export const createNote: RequestHandler = async (req, res, next) => {
  try {
    const { noteInfo, contactId } = req.body

    const note = await prisma.note.create({
      data: {
        ...noteInfo,
        contactId
      }
    })

    if (!note) res.status(500).json({ data: req.body, error: 'Oops something went wrong' })

    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const exists = await prisma.note.count({ where: { id: req.params.id, isDeleted: false } })

    if (!exists) res.status(404).json({ error: 'bad request' })

    const note = await prisma.note.update({ where: { id: req.params.id }, data: { ...req.body } })

    res.status(200).json(note)
  } catch (error) {
    next(error)
  }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const exists = await prisma.note.count({ where: { id: req.params.id, isDeleted: false } })

    if (!exists) res.status(404).json({ error: 'bad request' })

    await prisma.note.update({ where: { id: req.params.id }, data: { isDeleted: true } })

    res.status(200).json({ msg: 'Deleted Successfully' })
  } catch (error) {
    next(error)
  }
}

export const deleteManyNotes: RequestHandler = async (req, res, next) => {
  try {
    const { ids } = req.body
    const errors = []

    ids.forEach(async (id: string) => {
      const exists = await prisma.note.count({ where: { id, isDeleted: false } })
      if (!exists) errors.push(`Error: note with id: ${id} does not exist`)
      await prisma.note.update({ where: { id }, data: { isDeleted: true } })
    })
  } catch (error) {
    next(error)
  }
}
