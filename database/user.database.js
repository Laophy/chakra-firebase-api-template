import {
	adminMessages,
	serverMessages,
	userMessages,
} from '../utils/constants.js'
import { handleResponse } from '../utils/responseHandler.js'
import { userModel } from './models/user/user.model.js'
import { logUserAction } from '../utils/logging/user/logUserAction.js'
import { logAdminAction } from '../utils/logging/admin/logAdminAction.js'
import { handleError } from '../utils/handleError.js'

export const findAllUsers = async () => {
	try {
		const allUsers = await userModel.find({})
		return handleResponse({ message: userMessages.SUCCESS, data: allUsers })
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const getUserByID = async firebaseUser => {
	try {
		const locatedUser = await userModel.find({ uid: firebaseUser.uid })
		if (locatedUser.length < 1) {
			return handleResponse(
				{
					message: userMessages.USER_UPDATED,
				},
				true
			)
		} else {
			return handleResponse({
				message: userMessages.SUCCESS,
				data: locatedUser[0],
			})
		}
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const addUserByAuth = async firebaseUser => {
	try {
		// Check if user already exists
		const existingUser = await userModel.findOne({ uid: firebaseUser.uid })
		if (existingUser) {
			return handleResponse(
				{ message: userMessages.USER_ALREADY_EXISTS },
				true
			)
		}

		// Extract only the properties provided by firebaseUser
		const newUser = {
			uid: firebaseUser.uid,
			displayName: firebaseUser.displayName,
			username: firebaseUser.displayName,
			email: firebaseUser.email,
			createdAt: firebaseUser.createdAt,
			lastLoginAt: firebaseUser.lastLoginAt,
			photoURL: firebaseUser.photoURL,
			apiKey: firebaseUser.apiKey,
			bio: firebaseUser.bio,
		}

		// Remove undefined properties
		Object.keys(newUser).forEach(
			key => newUser[key] === undefined && delete newUser[key]
		)

		// Set default values for required fields
		newUser.photoURL = newUser.photoURL || ''
		newUser.bio = newUser.bio || ''

		const createdUser = await userModel.create(newUser)
		if (!createdUser) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}

		return handleResponse({
			message: userMessages.USER_CREATED,
			data: createdUser,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const updateUserData = async (user, uid, newUserData) => {
	try {
		// Check if the requesting user is staff or updating their own data
		if (!user.isStaff && user.uid !== uid) {
			return handleResponse(
				{
					message:
						'Unauthorized: You can only update your own data or be a staff member',
				},
				true
			)
		}

		// Check if user to be updated exists
		const userToUpdate = await userModel.findOne({ uid })
		if (!userToUpdate) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}

		// Filter out undefined values and create update object
		const updateFields = Object.entries(newUserData).reduce(
			(acc, [key, value]) => {
				if (value !== undefined && userToUpdate[key] !== value) {
					acc[key] = value
				}
				return acc
			},
			{}
		)

		console.log(updateFields)

		// Check if there are any changes
		if (Object.keys(updateFields).length === 0) {
			return handleResponse(
				{ message: userMessages.NO_CHANGES_FOUND },
				true
			)
		}

		// Update user data
		const updatedUser = await userModel.findOneAndUpdate(
			{ uid },
			{ $set: updateFields },
			{ new: true, runValidators: true }
		)

		if (!updatedUser) {
			return handleResponse({ message: userMessages.UPDATE_FAILED }, true)
		}

		// Log action
		if (user.isStaff && user.uid !== uid) {
			await logAdminAction(
				user.uid,
				adminMessages.UPDATED_USER_PROFILE,
				`Staff member ${user.uid} updated user ${uid}'s information.`
			)
		} else {
			await logUserAction(
				user.uid,
				userMessages.USER_UPDATED,
				`User ${user.uid} updated their own information.`
			)
		}

		return handleResponse({
			message: userMessages.USER_UPDATED,
			data: updatedUser,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const updateUsersUsername = async (authUser, newUsernameAndPhotoURL) => {
	try {
		const { username, photoURL } = newUsernameAndPhotoURL

		// Ensure the user can only update their own username
		const userToUpdate = await userModel.findOne({ uid: authUser.uid })

		if (!userToUpdate) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}

		if (authUser.uid !== userToUpdate.uid) {
			return handleResponse({ message: 'Unauthorized action' }, true)
		}

		// Check if there are any changes
		if (
			userToUpdate.username === username &&
			userToUpdate.photoURL === photoURL
		) {
			return handleResponse(
				{ message: userMessages.NO_CHANGES_FOUND },
				true
			)
		}

		const updatedUser = await userModel.findOneAndUpdate(
			{ uid: authUser.uid },
			{ username, photoURL },
			{ new: true, runValidators: true }
		)

		if (!updatedUser) {
			return handleResponse({ message: userMessages.UPDATE_FAILED }, true)
		}

		// Log user action
		await logUserAction(
			authUser.uid,
			userMessages.USER_UPDATED,
			`${authUser.username} updated their username to ${username} and photo to ${photoURL}`
		)

		return handleResponse({
			message: userMessages.USER_UPDATED,
			data: { username, photoURL },
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const promotePlayerToStaff = async (
	firebaseAuthUser,
	promotedPlayersUUID
) => {
	try {
		// Check if the user making the request exists and has the required permissions
		const requestingUser = await userModel.findOne({
			uid: firebaseAuthUser.uid,
		})
		if (!requestingUser) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}
		if (!requestingUser.isStaff || !requestingUser.isHighStaff) {
			return handleResponse(
				{ message: userMessages.UNAUTHORIZED_ACTION },
				true
			)
		}

		// Find the user to be promoted
		const userToPromote = await userModel.findOne({
			uid: promotedPlayersUUID,
		})

		if (!userToPromote) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}

		// Check if the user is already staff
		if (userToPromote.isStaff) {
			return handleResponse(
				{ message: adminMessages.USER_ALREADY_STAFF },
				true
			)
		}

		// Update the user to be promoted
		const updatedUser = await userModel.findOneAndUpdate(
			{ uid: promotedPlayersUUID },
			{ isStaff: true },
			{ new: true }
		)

		// Log the promotion action
		await logAdminAction(
			firebaseAuthUser.uid,
			adminMessages.USER_PROMOTED_TO_STAFF,
			`${requestingUser.username} promoted ${updatedUser.username} to staff`
		)

		return handleResponse({ message: adminMessages.USER_PROMOTED_TO_STAFF })
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}

export const demoteStaffToPlayer = async (
	firebaseAuthUser,
	demotedPlayersUUID
) => {
	try {
		// Check if the user making the request exists and has the required permissions
		const requestingUser = await userModel.findOne({
			uid: firebaseAuthUser.uid,
		})
		if (!requestingUser) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}
		if (!requestingUser.isStaff || !requestingUser.isHighStaff) {
			return handleResponse(
				{ message: userMessages.UNAUTHORIZED_ACTION },
				true
			)
		}

		// Find the user to be demoted
		const userToDemote = await userModel.findOne({
			uid: demotedPlayersUUID,
		})

		if (!userToDemote) {
			return handleResponse(
				{ message: userMessages.USER_NOT_FOUND },
				true
			)
		}

		// Check if the user is already not staff
		if (!userToDemote.isStaff) {
			return handleResponse(
				{ message: adminMessages.USER_NOT_STAFF },
				true
			)
		}

		// Update the user to be demoted
		const updatedUser = await userModel.findOneAndUpdate(
			{ uid: demotedPlayersUUID },
			{ isStaff: false },
			{ new: true }
		)

		// Log the demotion action
		await logAdminAction(
			firebaseAuthUser.uid,
			adminMessages.USER_DEMOTED_FROM_STAFF,
			`${requestingUser.username} demoted ${updatedUser.username} from staff`
		)

		return handleResponse({
			message: adminMessages.USER_DEMOTED_FROM_STAFF,
		})
	} catch (e) {
		const { errorMessage, errorDetails } = handleError(e)
		return handleResponse({ message: errorMessage }, true, errorDetails)
	}
}
