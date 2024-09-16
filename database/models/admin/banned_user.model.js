import mongoose from 'mongoose'

const collectionName = 'banned_users'
const schema = new mongoose.Schema(
	{
		uid: String,
		isBanned: Boolean,
		reason: String,
		dateBanned: String,
		dateUnbanned: String,
	},
	{ collection: collectionName }
)

export const bannedUserModel = mongoose.model(collectionName, schema)
