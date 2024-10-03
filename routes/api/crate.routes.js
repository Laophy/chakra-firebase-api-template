import { Router } from 'express'
import fetch from 'node-fetch'
import * as CrateDB from '../../database/crate.database.js'
import { authenticateFirebaseToken } from '../../logic/middleware/authenticateFirebaseToken.middleware.js'
import { handleResponse } from '../../utils/responseHandler.js'
import { decodeEndpoint } from '../../logic/middleware/encryptResponse.middleware.js'
import {
	handleRequest,
	validateParams,
	validateRequestBody,
} from '../../logic/middleware/requestHandler.middleware.js'

const router = Router()

router.get('/crate.:encodedEndpoint', async (req, res, next) => {
	const endpoint = decodeEndpoint(req)
	console.log('endpoint', endpoint)
	switch (endpoint) {
		case 'getCrates':
			handleRequest(req, res, async () => {
				console.log('attempting to get all crates')
				return await CrateDB.getAllCrates()
			})
			break
		default:
			if (endpoint.startsWith('getCrateById/')) {
				handleRequest(req, res, async () => {
					console.log('attempting to get a crate by id')
					const crateId = endpoint.split('/')[1]
					validateParams({ crateId }, ['crateId'])

					return await CrateDB.getCrateById(crateId)
				})
			} else {
				next()
			}
	}
})

router.post(
	'/crate.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		console.log('endpoint', endpoint)

		switch (endpoint) {
			case 'createCrate':
				handleRequest(req, res, async () => {
					console.log('attempting to create a crate')
					const authenticatedUserId = req.user.uid
					const crate = req.body.crate
					validateRequestBody(req.body, ['crate']) // Required fields for creating a crate

					const result = await CrateDB.createCrate(
						authenticatedUserId,
						crate
					)

					return result
				})
				break
			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

router.put(
	'/crate.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			case 'updateCrate':
				handleRequest(req, res, async () => {
					console.log('attempting to update crate')
					const authenticatedUserId = req.user.uid
					const crate = req.body.crate
					validateRequestBody(req.body, ['crate']) // Required fields for creating a crate

					const result = await CrateDB.updateCrate(
						authenticatedUserId,
						crate
					)

					return result
				})
				break
			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

router.delete(
	'/crate.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			default:
				if (endpoint.startsWith('deleteCrate/')) {
					handleRequest(req, res, async () => {
						console.log('attempting to delete a crate by id')
						const authenticatedUserId = req.user.uid
						const crateId = endpoint.split('/')[1]
						validateParams({ crateId }, ['crateId'])

						return await CrateDB.deleteCrate(
							authenticatedUserId,
							crateId
						)
					})
				} else {
					return handleResponse({ message: 'Invalid endpoint' }, true)
				}
		}
	}
)

export default router
