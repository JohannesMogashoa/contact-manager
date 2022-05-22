import { Router } from 'express'
import { auth } from './middleware/auth'

import {
  getAllContacts,
  getContact,
  createContact,
  editContact,
  deleteContact,
  deleteManyContacts
} from './controllers/contacts_controller'

const router = Router()

// CONTACT CRUD
router.get('/', auth, getAllContacts)
router.get('/:id', auth, getContact)
router.post('/create', auth, createContact)
router.put('/edit/:id', auth, editContact)
router.delete('/delete/:id', auth, deleteContact)
router.post('/delete-many', auth, deleteManyContacts)

export default router
