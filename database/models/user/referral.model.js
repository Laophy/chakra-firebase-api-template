import mongoose from 'mongoose'

const collectionName = 'referrals'

const referralCodeSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	code: { type: String, required: true, unique: true },
	totalDepositAmountUSD: { type: Number, default: 0, min: 0 },
	totalWagerAmountUSD: { type: Number, default: 0, min: 0 },
	totalEarnings: { type: Number, default: 0, min: 0 },
	claimedEarnings: { type: Number, default: 0, min: 0 },
	commissionRate: { type: Number, default: 0.05, min: 0, max: 1 },
})

const referralSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		referralCode: referralCodeSchema,
		referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		collection: collectionName,
		timestamps: true,
	}
)

referralSchema.index({ userId: 1 }, { unique: true })
referralSchema.index({ 'referralCode.code': 1 }, { unique: true })

export const referralModel = mongoose.model(collectionName, referralSchema)
