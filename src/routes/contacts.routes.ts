import { Router } from 'express'
import auth from '../middleware/auth.middleware'

import {
  getAllContacts,
  getContact,
  createContact,
  editContact,
  deleteContact,
  deleteManyContacts
} from '../controllers/contacts.controller'

const router = Router()

// CONTACT CRUD
router.get('/', auth, getAllContacts)
router.get('/:id', auth, getContact)
router.post('/create', auth, createContact)
router.put('/edit/:id', auth, editContact)
router.delete('/delete/:id', auth, deleteContact)
router.delete('/delete-many', auth, deleteManyContacts)

export default router
