import mongoose from 'mongoose'

const collectionName = 'products'

const productSchema = new mongoose.Schema(
	{
		productId: { type: String, required: true, unique: true, index: true },
		name: { type: String, required: true },
		description: { type: String },
		price: { type: Number, required: true },
		category: { type: String },
		imageUrl: { type: String }, // URL for the product image
		attributes: {
			rarity: {
				type: String,
				enum: ['common', 'uncommon', 'rare', 'legendary'],
			}, // Example of special attributes
			specialEdition: { type: Boolean, default: false },
		},
	},
	{ timestamps: true }
)

export const productModel = mongoose.model(collectionName, productSchema)
