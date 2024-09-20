import { serverMessages } from './constants.js'

export const handleError = e => {
	let errorMessage = serverMessages.UNKNOWN_ERROR
	let errorDetails = [e]

	switch (e.name) {
		case 'ValidationError':
			errorMessage = serverMessages.INVALID_DATA
			break
		case 'MongoError':
			if (e.code === 11000) {
				errorMessage = serverMessages.MONGO_ERROR
			}
			break
		case 'CastError':
			errorMessage = 'Invalid data type provided'
			break
		default:
			// For unexpected errors, we'll use the default UNKNOWN_ERROR message
			break
	}

	return { errorMessage, errorDetails }
}
