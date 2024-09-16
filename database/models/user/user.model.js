import mongoose from 'mongoose'

const collectionName = 'users'
const schema = new mongoose.Schema(
	{
		uid: String,
		displayName: String,
		username: String,
		createdAt: String,
		photoURL: String,
		email: String,
		apiKey: String,
		lastLoginAt: String,
		banned: {
			isBanned: Boolean,
			unbanDate: String,
			reaason: String,
		},
		isStaff: Boolean,
		isHighStaff: Boolean,
		referralCode: String,
		affiliate: {
			code: String,
			users: Number,
			totalDeposited: Number,
			totalOpened: Number,
			totalEarnings: Number,
			unclaimedEarnings: Number,
			lastChanged: String,
		},
		title: Object,
		balance: Number,
	},
	{ collection: collectionName }
)

export const userModel = mongoose.model(collectionName, schema)
