import { Router } from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
dotenv.config()

const router = Router()

// Security Middleware
router.use(helmet())

// Router Imports
import UserRoutes from './api/user.routes.js'
import ProductRoutes from './api/product.routes.js'
import CrateRoutes from './api/crate.routes.js'

// Router Utilizations
router.use('/user', UserRoutes)
router.use('/product', ProductRoutes)
router.use('/crate', CrateRoutes)

// Error Handling Middleware
router.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

export default router
