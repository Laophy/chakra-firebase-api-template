import mongoose from 'mongoose'

const collectionName = 'inventories'

const inventorySchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, index: true }, // Firebase UID
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		quantity: { type: Number, default: 1, min: 0 },
		acquiredAt: { type: Date, default: Date.now }, // When the item was added to the inventory
	},
	{ timestamps: true }
)

export const inventoryModel = mongoose.model(collectionName, inventorySchema)
