import mongoose from 'mongoose'

const collectionName = 'banned_users'
const schema = new mongoose.Schema(
	{
		uid: {
			type: String,
			required: true,
			index: true,
		},
		isBanned: {
			type: Boolean,
			required: true,
			default: true,
		},
		reason: {
			type: String,
			required: true,
		},
		dateBanned: {
			type: Date,
			required: true,
			default: Date.now,
		},
		dateUnbanned: {
			type: Date,
		},
		bannedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		unbannedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		collection: collectionName,
		timestamps: true,
	}
)

schema.index({ uid: 1 }, { unique: true })
schema.index({ isBanned: 1 })
schema.index({ dateBanned: -1 })

export const bannedUserModel = mongoose.model(collectionName, schema)
