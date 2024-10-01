import mongoose from 'mongoose'

const collectionName = 'crates'

const crateSchema = new mongoose.Schema(
	{
		crateId: {
			type: String,
			unique: true,
			required: true,
		},
		visibility: { type: String, default: 'private' },
		name: { type: String, required: true, default: '' },
		description: { type: String, default: '' },
		price: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					return value > 0
				},
				message: 'Price must be a positive number (greater than 0)',
			},
		},
		category: { type: String, default: 'Uncategorized' },
		imageUrl: {
			type: String,
			default: 'https://example.com/default-image.png',
		},
		products: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'products',
			},
		],
	},
	{ timestamps: true }
)

export const crateModel = mongoose.model(collectionName, crateSchema)
