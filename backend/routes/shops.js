import express from 'express'
import * as shopsController from '../controllers/shopsController.js'

const router = express.Router()

router.get('/', shopsController.getAll)
router.get('/:id', shopsController.getById)
router.post('/', shopsController.create)
router.put('/:id', shopsController.update)
router.delete('/:id', shopsController.remove)

export default router
