import mongoose from 'mongoose'

const collectionName = 'affiliates'
const schema = new mongoose.Schema(
	{
		affiliateId: String,
		code: String,
		users: Number,
		totalDeposited: Number,
		totalOpened: Number,
		totalEarnings: Number,
		unclaimedEarnings: Number,
		lastChanged: String,
	},
	{ collection: collectionName }
)

export const affiliateModel = mongoose.model(collectionName, schema)
