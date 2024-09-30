import { userMessages, serverMessages } from '../../utils/constants.js'
import { handleResponse } from '../../utils/responseHandler.js'
import { encryptText } from './encryptResponse.middleware.js'

// Helper function for error handling
const handleRequest = async (req, res, callback) => {
	try {
		const result = await callback()
		if (result.result && result.result.data && result.result.data.json) {
			result.result.data.json = encryptText(
				JSON.stringify(result.result.data.json)
			)
			res.json(
				handleResponse({
					message: serverMessages.SUCCESS,
					data: result.result.data.json || {},
				})
			)
		} else {
			res.json(result)
		}
	} catch (error) {
		console.error(error)
		res.json(
			handleResponse(
				{
					message: serverMessages.INTERNAL_SERVER_ERROR,
					data: {},
				},
				true
			)
		)
	}
}

// Helper function for validation
const validateParams = (params, requiredFields) => {
	for (const field of requiredFields) {
		if (!params[field]) {
			throw new Error(`Missing required field: ${field}`)
		}
	}
}

// Helper function for validating request body
const validateRequestBody = (body, requiredFields) => {
	for (const field of requiredFields) {
		if (!body[field]) {
			throw new Error(`Missing required field: ${field}`)
		}
	}
}

export { handleRequest, validateParams, validateRequestBody }
