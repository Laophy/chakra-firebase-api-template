import { Router } from 'express'
import * as UserDB from '../../database/user.database.js'
import fetch from 'node-fetch'
const router = Router()

router.post('/getuser', async (req, res) => {
	const firebaseAuthUser = req.body.params.user

	let userData = await UserDB.getUserByID(firebaseAuthUser)
	if (!userData[0]) {
		userData = await UserDB.addUserByAuth(firebaseAuthUser)
		res.json(userData)
	} else {
		res.json(userData[0])
	}
})

router.post('/getallusers', async (req, res) => {
	let userData = await UserDB.findAllUsers()
	res.json(userData)
})

router.post('/updateusername', async (req, res) => {
	const firebaseAuthUser = req.body.params.user
	const newUsername = req.body.params.username

	const tryUpdateUsername = UserDB.updateUsersUsername(
		firebaseAuthUser,
		newUsername
	)
	res.json(tryUpdateUsername)
})

router.post('/updateuser', async (req, res) => {
	const uid = req.body.params.uid
	const newUserData = req.body.params.newUserData

	const tryUpdateUserInformation = UserDB.updateUserData(uid, newUserData)
	res.json(tryUpdateUserInformation)
})

export default router
