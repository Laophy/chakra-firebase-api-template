const createResponse = (status, message, errors) => ({
	status,
	message,
	errors,
})

const successResponse = errors => createResponse(200, 'success', errors)
const failedResponse = errors => createResponse(400, 'failure', errors)

export const handleResponse = (
	responseData = {},
	requestFailed = false,
	errors = []
) => {
	const { message = '', ...data } = responseData

	const response = {
		request: requestFailed
			? failedResponse(errors)
			: successResponse(errors),
		message: !message && requestFailed ? 'failure' : message,
		result: {
			data: {
				json: data.data,
			},
		},
	}

	return response
}
