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
// ... import other routes ...

// Router Utilizations
router.use('/user', UserRoutes)
// ... use other routes ...
router.use('/product', ProductRoutes)

// Error Handling Middleware
router.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

export default router
