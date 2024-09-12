import { userModel } from './models/user.model.js'

export const findAllUsers = async () => {
	const data = await userModel.find({})
	return data
}

export const getUserByID = async firebaseUser => {
	const savedUserData = await userModel.find({ uid: firebaseUser.uid })
	if (!savedUserData) {
		console.log('We didnt find any data for this user')
	} else {
		console.log('user data found')
	}
	return savedUserData
}

export const addUserByAuth = async firebaseUser => {
	const savedUserData = await userModel.find({ uid: firebaseUser.uid })
	if (!savedUserData[0]) {
		const newUser = {
			uid: firebaseUser.uid,
			displayName: firebaseUser.displayName,
			username: firebaseUser.displayName,
			createdAt: firebaseUser.createdAt,
			photoURL: firebaseUser.photoURL,
			email: firebaseUser.email,
			apiKey: firebaseUser.apiKey,
			lastLoginAt: firebaseUser.lastLoginAt,
			balance: 0,
		}
		userModel.create(newUser)
		console.log('Created a new user!')
		return newUser
	} else {
		console.log('Found old user!')
	}
	return await userModel.find({ uid: firebaseUser.uid })
}

export const updateUsersUsername = async (firebaseUser, newUsername) => {
	const savedUserData = await userModel.find({ uid: firebaseUser.uid })
	if (savedUserData[0]) {
		userModel
			.findOneAndUpdate({
				username: newUsername,
			})
			.then(() => {
				console.log('Updated user to new username')
				return { code: 200, message: 'Updated user to new username' }
			})
	} else {
		console.log('No user found! Cannot update username')
		return { code: 400, message: 'No user found! Cannot update username' }
	}
}
