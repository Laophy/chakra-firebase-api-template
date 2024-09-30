import mongoose from 'mongoose'

const collectionName = 'products'

const productSchema = new mongoose.Schema(
	{
		productId: {
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
		imageUrl: { type: String }, // URL for the product image
		attributes: {
			rarity: {
				type: String,
				enum: ['common', 'uncommon', 'rare', 'legendary'],
			},
		},
		canBeShipped: { type: Boolean, default: false },
		purchaseUrl: { type: String, default: '' },
	},
	{ timestamps: true }
)

export const productModel = mongoose.model(collectionName, productSchema)
