import { Router } from 'express'
const router = Router()

// Router Imports
import UserRoutes from './api/user.routes.js'

// Router Utilizations
router.use('/user', UserRoutes)

export default router
