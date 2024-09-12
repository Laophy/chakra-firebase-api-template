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
		balance: Number,
	},
	{ collection: collectionName }
)

export const userModel = mongoose.model(collectionName, schema)
