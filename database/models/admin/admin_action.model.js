import mongoose from 'mongoose'

const collectionName = 'admin_actions'
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

export const adminActionModel = mongoose.model(collectionName, schema)
