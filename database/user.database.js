import {
	adminMessages,
	serverMessages,
	userMessages,
} from '../utils/constants.js'
import { handleResponse } from '../utils/responseHandler.js'
import { adminActionModel } from './models/admin/admin_action.model.js'
import { userModel } from './models/user/user.model.js'
import { userActionModel } from './models/user/user_action.model.js'

export const findAllUsers = async () => {
	try {
		const allUsers = await userModel.find({})
		return handleResponse(allUsers)
	} catch (e) {
		return handleResponse(
			{
				message: serverMessages.UNKOWN_ERROR,
			},
			true
		)
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
			return handleResponse(locatedUser[0])
		}
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: serverMessages.UNKOWN_ERROR }, true, [
			e,
		])
	}
}

export const addUserByAuth = async firebaseUser => {
	try {
		const newUser = {
			uid: firebaseUser.uid,
			displayName: firebaseUser.displayName,
			username: firebaseUser.displayName,
			createdAt: firebaseUser.createdAt,
			photoURL: firebaseUser.photoURL ? firebaseUser.photoURL : '',
			email: firebaseUser.email,
			apiKey: firebaseUser.apiKey,
			lastLoginAt: firebaseUser.lastLoginAt,
			banned: {
				isBanned: false,
				unbanDate: '',
				reaason: '',
			},
			isStaff: false,
			isHighStaff: false,
			referralCode: '',
			affiliate: {
				code: '',
				users: 0,
				totalDeposited: 0,
				totalOpened: 0,
				totalEarnings: 0,
				unclaimedEarnings: 0,
				lastChanged: '',
			},
			title: { title: '', color: '' },
			balance: 0,
		}
		await userModel.create(newUser)
		return handleResponse(newUser)
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: serverMessages.UNKOWN_ERROR }, true, [
			e,
		])
	}
}

export const updateUserData = async (uid, newUserData) => {
	try {
		await userModel
			.findOneAndUpdate(
				{ uid },
				{
					username: newUserData.username,
					photoURL: newUserData.photoURL,
					email: newUserData.email,
					title: newUserData.title,
					referralCode: newUserData.referralCode,
					affiliate: newUserData.affiliate,
					balance: newUserData.balance,
				}
			)
			.then(() => {
				const action = {
					uid,
					action: 'Updated user information',
					message: `Successfully updated user information.`,
					status: 'Success',
					timestamp: new Date(),
				}
				adminActionModel.create(action)
			})
		return handleResponse({
			message: userMessages.USER_UPDATED,
		})
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: userMessages.USER_NOT_FOUND }, true, [
			e,
		])
	}
}

export const updateUsersUsername = async (firebaseAuthUser, newUsername) => {
	try {
		await userModel
			.findOneAndUpdate(
				{ uid: firebaseAuthUser.uid },
				{
					username: newUsername.username,
					photoURL: newUsername.photoURL,
				}
			)
			.then(() => {
				const userAction = {
					uid: firebaseAuthUser.uid,
					action: 'Updated user information',
					message: `${firebaseAuthUser?.username} updated their username to ${newUsername?.username}`,
					status: 'Success',
					timestamp: new Date(),
				}
				userActionModel.create(userAction)
			})
		return handleResponse({
			message: userMessages.USER_UPDATED,
		})
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: userMessages.USER_NOT_FOUND }, true, [
			e,
		])
	}
}

export const promotePlayerToStaff = async (
	firebaseAuthUser,
	promotedPlayersUUID
) => {
	try {
		await userModel.findOneAndUpdate(
			{ uid: promotedPlayersUUID },
			{
				isStaff: true,
			}
		)
		return handleResponse({ message: adminMessages.USER_PROMOTED_TO_STAFF })
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: userMessages.USER_NOT_FOUND }, true, [
			e,
		])
	}
}

export const demotePlayerToStaff = async (
	firebaseAuthUser,
	promotedPlayersUUID
) => {
	try {
		await userModel.findOneAndUpdate(
			{ uid: promotedPlayersUUID },
			{
				isStaff: false,
			}
		)
		return handleResponse({
			message: adminMessages.USER_DEMOTED_FROM_STAFF,
		})
	} catch (e) {
		console.log(e.message)
		return handleResponse({ message: userMessages.USER_NOT_FOUND }, true, [
			e,
		])
	}
}
