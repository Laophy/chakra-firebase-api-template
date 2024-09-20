import mongoose from 'mongoose'

const collectionName = 'wallets'
const schema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		walletAddress: {
			type: String,
			required: true,
			unique: true,
		},
		privateKey: {
			type: String,
			required: true,
			select: false, // This ensures the private key is not returned in queries by default
		},
		balance: {
			type: Number,
			default: 0,
			min: 0,
		},
		currency: {
			type: String,
			required: true,
			enum: ['USD', 'EUR', 'BTC', 'ETH', 'LTC'], // Add more currencies as needed
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		collection: collectionName,
		timestamps: true,
	}
)

// Index for faster queries
schema.index({ userId: 1, currency: 1 })

export const walletModel = mongoose.model(collectionName, schema)
