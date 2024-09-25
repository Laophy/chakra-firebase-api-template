import { Router } from 'express'
import fetch from 'node-fetch'

const router = Router()

router.get('/', async (req, res) => {
	res.json({ data })
})

export default router
