import { Router } from 'express'
import * as UserDB from '../../database/user.database.js'
import fetch from 'node-fetch'
import crypto from 'crypto' // Import crypto module

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
		const encryptedResult = encrypt(JSON.stringify(result)) // Encrypt the result
		res.json({ data: encryptedResult }) // Send encrypted data
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

router.post('/user.getUser', async (req, res) => {
	handleRequest(req, res, async () => {
		const { user: firebaseAuthUser } = req.body.params
		validateParams(req.body.params, ['user'])

		let getUserDataResponse = await UserDB.getUserByID(firebaseAuthUser)
		if (getUserDataResponse.request.message === 'failure') {
			console.log('Failed to get user, adding new user')
			return await UserDB.addUserByAuth(firebaseAuthUser)
		} else {
			return getUserDataResponse
		}
	})
})

router.post('/user.getAllUsers', async (req, res) => {
	handleRequest(req, res, async () => {
		return await UserDB.findAllUsers()
	})
})

router.post('/user.updateUsername', async (req, res) => {
	handleRequest(req, res, async () => {
		const { user: firebaseAuthUser, username: newUsername } =
			req.body.params
		validateParams(req.body.params, ['user', 'username'])

		return await UserDB.updateUsersUsername(firebaseAuthUser, newUsername)
	})
})

router.post('/user.promoteUser', async (req, res) => {
	handleRequest(req, res, async () => {
		const { user: firebaseAuthUser, uid: promotedPlayersUUID } =
			req.body.params
		validateParams(req.body.params, ['user', 'uid'])

		return await UserDB.promotePlayerToStaff(
			firebaseAuthUser,
			promotedPlayersUUID
		)
	})
})

router.post('/user.demoteUser', async (req, res) => {
	handleRequest(req, res, async () => {
		const { user: firebaseAuthUser, uid: demotedPlayersUUID } =
			req.body.params
		validateParams(req.body.params, ['user', 'uid'])

		return await UserDB.demoteStaffToPlayer(
			firebaseAuthUser,
			demotedPlayersUUID
		)
	})
})

router.post('/user.updateUser', async (req, res) => {
	handleRequest(req, res, async () => {
		const { user, uid, newUserData } = req.body.params
		validateParams(req.body.params, ['user', 'uid', 'newUserData'])

		return await UserDB.updateUserData(user, uid, newUserData)
	})
})

export default router
