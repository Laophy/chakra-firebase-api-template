import { Router } from 'express'
import * as UserDB from '../../database/user.database.js'
import { authenticateFirebaseToken } from '../../logic/middleware/authenticateFirebaseToken.middleware.js'
import { handleResponse } from '../../utils/responseHandler.js'
import { decodeEndpoint } from '../../logic/middleware/encryptResponse.middleware.js'
import {
	handleRequest,
	validateParams,
} from '../../logic/middleware/requestHandler.middleware.js'
const router = Router()

router.post('/user.:encodedEndpoint', async (req, res, next) => {
	const endpoint = decodeEndpoint(req)

	switch (endpoint) {
		case 'getUser':
			handleRequest(req, res, async () => {
				const { user } = req.body.params
				validateParams(req.body.params, ['user'])

				const getUserDataResponse = await UserDB.getAccount(
					user.email,
					user.uid
				)
				return getUserDataResponse
			})
			break

		case 'createUser':
			handleRequest(req, res, async () => {
				const { user } = req.body.params
				validateParams(req.body.params, ['user'])

				let getUserDataResponse

				if (user.email) {
					getUserDataResponse = await UserDB.getUserByEmail(user)
				}

				if (!getUserDataResponse && user.uid) {
					getUserDataResponse = await UserDB.getUserByID(user)
				}

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

			case 'deleteUser':
				handleRequest(req, res, async () => {
					const { user } = req.body.params
					const authenticatedUserId = req.user.uid
					validateParams(req.body.params, ['user'])

					// Use the new function to delete the user
					const deleteUserResponse = await UserDB.deleteUser(
						authenticatedUserId,
						user
					)

					if (deleteUserResponse.request.message === 'failure') {
						return handleResponse(
							{ message: 'User not found' },
							true
						)
					}

					return handleResponse(
						{ message: 'User successfully deleted' },
						false
					)
				})
				break

			default:
				return handleResponse({ message: 'Invalid endpoint' }, true)
		}
	}
)

export default router
