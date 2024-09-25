// Import the user model from the database
import { userModel } from '../../database/models/user/user.model.js'

/**
 * Find a user by their unique identifier (UID)
 * @param {string} uid - The user's unique identifier
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const findUserByUID = async uid => {
	return await userModel.findOne({ uid })
}

/**
 * Retrieve all users from the database
 * @returns {Promise<Array>} An array of all user objects
 */
export const findAllUsers = async () => {
	return await userModel.find({})
}

/**
 * Find a user by their email address
 * @param {string} email - The user's email address
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const findUserByEmail = async email => {
	return await userModel.findOne({ email })
}

/**
 * Find a user by either their email address or UID
 * @param {string} email - The user's email address
 * @param {string} uid - The user's unique identifier
 * @returns {Promise<Object|null>} The user object if found, null otherwise
 */
export const findUserByEmailOrUID = async (email, uid) => {
	const user = await userModel.findOne({
		$or: [{ email }, { uid }],
	})

	if (user) {
		if (user.email === email && user.uid !== uid && uid !== null) {
			console.log(`User found by email: ${email}, updating UID`)
			return await updateUserUID(user.uid, uid)
		} else if (user.uid === uid) {
			console.log(`User found by UID: ${uid}`)
		} else {
			console.log(`User found by email: ${email}`)
		}
	} else {
		console.log('User not found')
	}

	return user
}

/**
 * Update a user's UID
 * @param {string} currentUID - The user's current unique identifier
 * @param {string} newUID - The new unique identifier to be set
 * @returns {Promise<Object|null>} The updated user object if successful, null otherwise
 */
export const updateUserUID = async (currentUID, newUID) => {
	const user = await userModel.findOneAndUpdate(
		{ uid: currentUID },
		{ uid: newUID },
		{ new: true }
	)

	if (user) {
		console.log(`User UID updated from ${currentUID} to ${newUID}`)
	} else {
		console.log(`User with UID ${currentUID} not found`)
	}

	return user
}
