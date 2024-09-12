import mongoose from 'mongoose'

const collectionName = 'Example'
const schema = new mongoose.Schema(
	{
		example: String,
	},
	{ collection: collectionName }
)

export const exampleModel = mongoose.model(collectionName, schema)
