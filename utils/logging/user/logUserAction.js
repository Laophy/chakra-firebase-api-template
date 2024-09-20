import { userActionModel } from '../../../database/models/user/user_action.model.js'

export const logUserAction = async (
	uid,
	action,
	message,
	status = 'Success'
) => {
	try {
		const userAction = {
			uid,
			action,
			message,
			status,
			timestamp: new Date(),
		}
		await userActionModel.create(userAction)
	} catch (e) {
		console.error('Error logging user action:', e)
	}
}
