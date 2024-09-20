import mongoose from 'mongoose'

const collectionName = 'user_actions'
const schema = new mongoose.Schema(
	{
		uid: {
			type: String,
			required: true,
			index: true,
		},
		action: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['Success', 'Failure', 'Pending'],
			default: 'Success',
		},
		timestamp: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: collectionName,
	}
)

schema.index({ uid: 1, timestamp: -1 })

export const userActionModel = mongoose.model(collectionName, schema)
