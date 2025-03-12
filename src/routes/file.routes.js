import express from 'express'
import { getAllFiles } from '../controllers/file.controller.js'

const router = express.Router()

router.get('/', getAllFiles)

export default router