import mongoose from 'mongoose'

const collectionName = 'user_actions'
const schema = new mongoose.Schema(
	{
		uid: String,
		action: String,
		message: String,
		status: String,
		timestamp: String,
	},
	{ collection: collectionName }
)

export const userActionModel = mongoose.model(collectionName, schema)
