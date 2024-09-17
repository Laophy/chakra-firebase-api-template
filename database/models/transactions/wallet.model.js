import mongoose from 'mongoose'

const collectionName = 'wallets'
const schema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		walletAddress: { type: String, required: true },
		privateKey: { type: String, required: true },
		balance: { type: Number, default: 0 },
	},
	{ collection: collectionName }
)

export const walletModel = mongoose.model(collectionName, schema)
