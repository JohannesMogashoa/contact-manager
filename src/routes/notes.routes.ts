import { Router } from 'express'
import { createNote, deleteManyNotes, deleteNote, updateNote } from '../controllers/notes.controller'
import auth from '../middleware/auth.middleware'

const router = Router()

router.post('/', auth, createNote)
router.put('/:id', auth, updateNote)
router.delete('/:id', auth, deleteNote)
router.delete('/delete-many', auth, deleteManyNotes)

export default router
