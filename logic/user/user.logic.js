// utils/userUtils.js
import { userModel } from '../../database/models/user/user.model.js'

export const findUserByUID = async uid => {
	return await userModel.findOne({ uid })
}

// New function to get all users
export const findAllUsers = async () => {
	return await userModel.find({})
}
