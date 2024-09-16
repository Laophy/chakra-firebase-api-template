import mongoose from 'mongoose'

const collectionName = 'deposits'
const schema = new mongoose.Schema(
	{
		transactionId: String,
		created: String,
		updated: String,
		provider: String,
		type: String,
		status: String,
		amount: Number,
	},
	{ collection: collectionName }
)

export const depositModel = mongoose.model(collectionName, schema)
