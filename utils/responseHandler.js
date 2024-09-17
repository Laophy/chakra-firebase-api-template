const successResponse = errors => {
	return {
		status: 200,
		message: 'success',
		errors: errors,
	}
}
const failedResponse = errors => {
	return {
		status: 400,
		message: 'failure',
		errors: errors,
	}
}

export const handleResponse = (
	responseData,
	requestFailed = false,
	errors = []
) => {
	let response

	if (requestFailed) {
		response = {
			request: failedResponse(errors),
			result: {
				data: {
					json: {},
				},
			},
		}
	} else {
		response = {
			request: successResponse(errors),
			result: {
				data: {
					json: responseData,
				},
			},
		}
	}

	return response
}
