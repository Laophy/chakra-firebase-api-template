import { Router } from 'express'
import * as UserDB from '../../database/user.database.js'
import fetch from 'node-fetch'
import crypto from 'crypto' // Import crypto module
import { authenticateFirebaseToken } from '../../logic/middleware/authenticateFirebaseToken.middleware.js'
import { handleResponse } from '../../utils/responseHandler.js'
const router = Router()

const ENCRYPTION_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6' // Must be 256 bits (32 characters)
const IV_LENGTH = 16 // For AES, this is always 16

// Helper function to encrypt data
const encrypt = text => {
	let iv = crypto.randomBytes(IV_LENGTH)
	let cipher = crypto.createCipheriv(
		'aes-256-cbc',
		Buffer.from(ENCRYPTION_KEY),
		iv
	)
	let encrypted = cipher.update(text)

	encrypted = Buffer.concat([encrypted, cipher.final()])

	return iv.toString('hex') + ':' + encrypted.toString('hex')
}

// Helper function for error handling
const handleRequest = async (req, res, callback) => {
	try {
		const result = await callback()
		if (result.result && result.result.data && result.result.data.json) {
			result.result.data.json = encrypt(
				JSON.stringify(result.result.data.json)
			)
		}
		res.json(result)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

// Helper function for validation
const validateParams = (params, requiredFields) => {
	for (const field of requiredFields) {
		if (!params[field]) {
			throw new Error(`Missing required field: ${field}`)
		}
	}
}

const decodeEndpoint = req => {
	return Buffer.from(req.params.encodedEndpoint, 'base64').toString('utf-8')
}

router.post('/user.:encodedEndpoint', async (req, res, next) => {
	const endpoint = decodeEndpoint(req)

	switch (endpoint) {
		case 'getUser':
			handleRequest(req, res, async () => {
				const { user } = req.body.params
				validateParams(req.body.params, ['user'])

				let getUserDataResponse = await UserDB.getUserByID(user)
				if (getUserDataResponse.request.message === 'failure') {
					console.log('User not found')
					return handleResponse({ message: 'User not found' }, true)
				} else {
					return getUserDataResponse
				}
			})
			break

		case 'createUser':
			handleRequest(req, res, async () => {
				const { user } = req.body.params
				validateParams(req.body.params, ['user'])

				let getUserDataResponse = await UserDB.getUserByID(user)
				if (
					!getUserDataResponse ||
					getUserDataResponse.request.message === 'failure'
				) {
					console.log('User not found, adding new user')
					return await UserDB.addUserByAuth(user)
				} else {
					return getUserDataResponse
				}
			})
			break

		case 'getAllUsers':
			handleRequest(req, res, async () => {
				return await UserDB.getAllUsers()
			})
			break

		default:
			// Pass control to the next middleware (authenticated routes)
			next()
	}
})

router.post(
	'/user.:encodedEndpoint',
	authenticateFirebaseToken,
	async (req, res) => {
		const endpoint = decodeEndpoint(req)

		switch (endpoint) {
			case 'updateUsername':
				handleRequest(req, res, async () => {
					console.log('starting to update username')
					const { newUsernameAndPhotoURL } = req.body.params
					const authenticatedUserId = req.user.uid
					validateParams(req.body.params, ['newUsernameAndPhotoURL'])

					const result = await UserDB.updateUsersUsername(
						authenticatedUserId,
						newUsernameAndPhotoURL
					)

					return result
				})
				break

			case 'promoteUser':
				handleRequest(req, res, async () => {
					const { promotedPlayersUUID } = req.body.params
					const authenticatedUserId = req.user.uid
					validateParams(req.body.params, ['promotedPlayersUUID'])

					return await UserDB.promotePlayerToStaff(
						authenticatedUserId,
						promotedPlayersUUID
					)
				})
				break

			case 'demoteUser':
				handleRequest(req, res, async () => {
					const { demotedPlayersUUID } = req.body.params
					const authenticatedUserId = req.user.uid
					validateParams(req.body.params, ['demotedPlayersUUID'])

					return await UserDB.demoteStaffToPlayer(
						authenticatedUserId,
						demotedPlayersUUID
					)
				})
				break

			case 'updateUser':
				handleRequest(req, res, async () => {
					const { user, uid, newUserData } = req.body.params
					const authenticatedUserId = req.user.uid
					validateParams(req.body.params, [
						'user',
						'uid',
						'newUserData',
					])

					return await UserDB.updateUserData(
						authenticatedUserId,
						user,
						uid,
						newUserData
					)
				})
				break

			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

export default router
