import { Router } from 'express'
import * as UserDB from '../../database/user.database.js'

import fetch from 'node-fetch'
const router = Router()

router.post('/user.getUser', async (req, res) => {
	const firebaseAuthUser = req.body.params.user

	let getUserDataResponse = await UserDB.getUserByID(firebaseAuthUser)
	if (getUserDataResponse.request.message === 'failure') {
		console.log('we failed adding new user')
		const addedUserResponse = await UserDB.addUserByAuth(firebaseAuthUser)
		res.json(addedUserResponse)
	} else {
		res.json(getUserDataResponse)
	}
})

router.post('/user.getAllUsers', async (req, res) => {
	let userData = await UserDB.findAllUsers()
	res.json(userData)
})

router.post('/user.updateUsername', async (req, res) => {
	const firebaseAuthUser = req.body.params.user
	const newUsername = req.body.params.username

	const updateUsernameResponse = await UserDB.updateUsersUsername(
		firebaseAuthUser,
		newUsername
	)
	res.json(updateUsernameResponse)
})

router.post('/user.promoteUser', async (req, res) => {
	const firebaseAuthUser = req.body.params.user
	const promotedPlayersUUID = req.body.params.uid

	const tryPromoteStaff = await UserDB.promotePlayerToStaff(
		firebaseAuthUser,
		promotedPlayersUUID
	)
	res.json(tryPromoteStaff)
})

router.post('/user.demoteUser', async (req, res) => {
	const firebaseAuthUser = req.body.params.user
	const demotedPlayersUUID = req.body.params.uid

	const tryDemoteStaff = await UserDB.demotePlayerToStaff(
		firebaseAuthUser,
		demotedPlayersUUID
	)
	res.json(tryDemoteStaff)
})

router.post('/user.updateUser', async (req, res) => {
	const uid = req.body.params.uid
	const newUserData = req.body.params.newUserData

	const tryUpdateUserInformation = await UserDB.updateUserData(
		uid,
		newUserData
	)
	res.json(tryUpdateUserInformation)
})

export default router
