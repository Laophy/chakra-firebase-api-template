export const serverMessages = {
	SUCCESS: 'Operation completed successfully.',
	UNKNOWN_ERROR: 'An unknown error occured.',
	INTERNAL_SERVER_ERROR: 'Internal server error.',
	INVALID_DATA: 'Bad data was retrieved.',
	MONGO_ERROR: 'Failed to update the db.',
	UNAUTHORIZED: 'Unauthorized request.',
}

export const userMessages = {
	SUCCESS: 'Data retrieved successfully.',
	USER_NOT_FOUND: 'User could not be found.',
	UPDATE_FAILED: 'User could not be updated.',
	USER_CREATION_FAILED: 'User could not be created.',
	EMAIL_ALREADY_EXISTS: 'Email already exists.',
	USERNAME_ALREADY_EXISTS: 'Username already exists.',
	NO_CHANGES_FOUND: 'No changes were made.',
	USER_ALREADY_EXISTS: 'User already exsists.',
	USER_CREATED: 'User successfully created.',
	USER_UPDATED: 'User successfully updated.',
}

export const adminMessages = {
	USER_PROMOTED_TO_STAFF: 'User successfully promoted to staff.',
	USER_DEMOTED_FROM_STAFF: 'User successfully demoted to player.',
	USER_ALREADY_STAFF: 'User is already staff.',
	USER_NOT_STAFF: 'User is not currently staff.',
	UPDATED_USER_PROFILE: 'Updated user information.',
}

export const productMessages = {
	PRODUCT_DELETED: 'Product successfully deleted.',
	PRODUCT_CREATED: 'Product successfully created.',
	PRODUCT_UPDATED: 'Product successfully updated.',
	PRODUCT_NOT_FOUND: 'Product could not be found.',
	PRODUCT_CREATION_FAILED: 'Product could not be created.',
	PRODUCT_UPDATE_FAILED: 'Product could not be updated.',
	INVALID_PRICE: 'Price must be a positive number (greater than 0)',
	INVALID_NAME_AND_PRICE: 'Name and price are required',
	INVALID_VISIBILITY: 'Visibility must be either "private" or "public"',
}

export const crateMessages = {
	CRATE_CREATED: 'Crate successfully created.',
	CRATE_UPDATED: 'Crate successfully updated.',
	CRATE_DELETED: 'Crate successfully deleted.',
	CRATE_NOT_FOUND: 'Crate could not be found.',
	CRATE_ALREADY_EXISTS: 'Crate already exists.',
	CRATE_CREATION_FAILED: 'Crate could not be created.',
	CRATE_UPDATE_FAILED: 'Crate could not be updated.',
	INVALID_PRICE: 'Price must be a positive number (greater than 0)',
	INVALID_NAME_AND_PRICE: 'Name and price are required',
	INVALID_VISIBILITY: 'Visibility must be either "private" or "public"',
}
