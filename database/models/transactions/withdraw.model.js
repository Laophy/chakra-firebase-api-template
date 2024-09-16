import mongoose from 'mongoose'

const collectionName = 'withdrawls'
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

export const withdrawlModel = mongoose.model(collectionName, schema)
