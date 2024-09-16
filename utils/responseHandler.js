const successResponse = {
	status: 200,
	message: 'success',
}
const failedResponse = {
	status: 400,
	message: 'failure',
}

export const handleResponse = (responseData, requestFailed = false) => {
	let response

	if (requestFailed) {
		response = {
			request: failedResponse,
			result: {
				data: {
					json: {},
				},
			},
		}
	} else {
		response = {
			request: successResponse,
			result: {
				data: {
					json: responseData,
				},
			},
		}
	}

	return response
}
