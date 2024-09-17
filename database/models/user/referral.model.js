import mongoose from 'mongoose'

const collectionName = 'referrals'
const schema = new mongoose.Schema(
	{
		referrals: { type: Array, default: [] },
		referralCode: {
			id: { type: String, required: true },
			code: { type: String, required: true },
			totalDepositAmountUSD: { type: Number, default: 0 },
			totalWagerAmountUSD: { type: Number, default: 0 },
			totalEarnings: { type: Number, default: 0 },
			claimedEarnings: { type: Number, default: 0 },
			commissionRate: { type: Number, default: 0.05 },
		},
	},
	{ collection: collectionName }
)

export const referralModel = mongoose.model(collectionName, schema)
