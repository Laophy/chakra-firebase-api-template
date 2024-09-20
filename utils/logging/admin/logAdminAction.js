import { adminActionModel } from '../../../database/models/admin/admin_action.model.js'

export const logAdminAction = async (
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
		await adminActionModel.create(userAction)
		console.log('saved a log')
	} catch (e) {
		console.error('Error logging user action:', e)
	}
}
