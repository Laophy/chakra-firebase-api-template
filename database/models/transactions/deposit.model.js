import mongoose from 'mongoose'

const collectionName = 'deposits'
const schema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		transactionId: {
			type: String,
			required: true,
			unique: true,
		},
		amount: {
			type: Number,
			required: true,
			min: 0,
		},
		currency: {
			type: String,
			required: true,
			enum: ['USD', 'EUR', 'BTC', 'ETH', 'LTC'], // Add more currencies as needed
		},
		status: {
			type: String,
			required: true,
			enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
			default: 'Pending',
		},
		provider: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ['Fiat', 'Crypto'],
		},
		sourceAddress: {
			type: String,
		},
		fee: {
			type: Number,
			default: 0,
			min: 0,
		},
		notes: String,
	},
	{
		collection: collectionName,
		timestamps: true,
	}
)

schema.index({ userId: 1, createdAt: -1 })
schema.index({ status: 1 })
schema.index({ transactionId: 1 }, { unique: true })

export const depositModel = mongoose.model(collectionName, schema)
